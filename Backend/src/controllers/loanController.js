const Loan = require('../models/Loan');
const User = require('../models/user');
const Settings = require('../models/Settings');
const asyncHandler = require('express-async-handler');

// Standard Amortization Schedule
const generateRepaymentSchedule = (amount, termMonths, annualRateDecimal) => {
  const schedule = [];
  let balance = amount;
  
  const monthlyRate = annualRateDecimal / 12;

  const emi = 
    (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  const addMonths = (date, months) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  for (let i = 1; i <= termMonths; i++) {
    const interestPart = balance * monthlyRate;
    let principalPart = emi - interestPart;

    if (i === termMonths || balance < principalPart) {
        principalPart = balance;
    }

    balance -= principalPart;

    const dueDate = addMonths(new Date(), i);

    schedule.push({
      installment: parseFloat((principalPart + interestPart).toFixed(2)),
      dueDate,
      amount: parseFloat(principalPart.toFixed(2)),
      interest: parseFloat(interestPart.toFixed(2)),
      remainingBalance: parseFloat(Math.max(0, balance).toFixed(2)),
      status: 'pending'
    });
  }

  return schedule;
};

// @desc    Create new loan
// @route   POST /api/loans
// @access  Private (Borrower)
const createLoan = asyncHandler(async (req, res) => {
  try {
    console.log('createLoan called - body:', req.body);
    console.log('createLoan - req.user:', req.user && { id: req.user._id, role: req.user.role });

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, no user information');
    }

    const { amount } = req.body;
    let termMonths = req.body.termMonths ?? req.body.term ?? req.body.duration;

    if (amount == null || termMonths == null) {
      res.status(400);
      throw new Error('Please provide an amount and a term (termMonths)');
    }

    termMonths = parseInt(termMonths, 10);
    if (isNaN(termMonths) || termMonths <= 0) {
      res.status(400);
      throw new Error('Invalid term (termMonths) value');
    }

    const loan = new Loan({
      borrower: req.user._id,
      amount,
      termMonths,
      status: 'pending',
    });

    const createdLoan = await loan.save();
    res.status(201).json(createdLoan);
  } catch (err) {
    console.error('createLoan error:', err.stack || err);
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({ message: err.message || 'Server error' });
  }
});

// @desc    Get logged in user's loans
// @route   GET /api/loans/myloans
// @access  Private (Borrower)
const getMyLoans = asyncHandler(async (req, res) => {
  const loans = await Loan.find({ borrower: req.user._id });
  res.json(loans);
});

// @desc    Get all loans (for admin)
// @route   GET /api/loans
// @access  Private (Admin)
const getAllLoans = asyncHandler(async (req, res) => {
  const status = req.query.status
    ? { status: req.query.status }
    : {}; 

  const loans = await Loan.find({ ...status }).populate('borrower', 'username email');
  res.json(loans);
});

// @desc    Get loan statistics
// @route   GET /api/loans/stats
// @access  Private (Admin)
const getLoanStats = asyncHandler(async (req, res) => {
  try {
    const stats = await Loan.aggregate([
      {
        $group: {
          _id: '$status', // Group by status (e.g., 'pending', 'approved')
          count: { $sum: 1 }, // Count how many loans in each group
          totalAmount: { $sum: '$amount' } // Sum the amount for each group
        }
      }
    ]);
    
    // Format the stats into a simple object for the frontend
    const formattedStats = stats.reduce((acc, stat) => {
      
      acc[stat._id] = {
        count: stat.count,
        totalAmount: stat.totalAmount
      };
      return acc;
    }, {});

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get loan by ID
// @route   GET /api/loans/:id
// @access  Private (Borrower or Admin)
const getLoanById = asyncHandler(async (req, res) => {
  const loan = await Loan.findById(req.params.id).populate(
    'borrower',
    'username email'
  );

  if (loan) {
    if (
      loan.borrower._id.toString() === req.user._id.toString() ||
      req.user.role === 'admin'
    ) {
      res.json(loan);
    } else {
      res.status(401);
      throw new Error('Not authorized to view this loan');
    }
  } else {
    res.status(404);
    throw new Error('Loan not found');
  }
});

// @desc    Update loan status (approve/reject)
// @route   PUT /api/loans/:id/status
// @access  Private (Admin)
const updateLoanStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body; 

    if (!status || (status !== 'approved' && status !== 'rejected')) {
      res.status(400);
      throw new Error('Invalid status');
    }

    const id = req.params.id;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(400);
      throw new Error('Invalid loan id');
    }

    const loan = await Loan.findById(id);

    if (!loan) {
      res.status(404);
      throw new Error('Loan not found');
    }
    
    if (loan.status === status) {
        return res.json(loan);
    }

    loan.status = status;

    if (status === 'approved') {
      const settings = await Settings.getSettings();
      const currentRate = settings.interestRate;
      
      loan.interestRate = currentRate; 
      
      loan.repaymentSchedule = generateRepaymentSchedule(
        loan.amount, 
        loan.termMonths ?? loan.term, 
        currentRate / 100
      );
    }

    const updatedLoan = await loan.save();
    res.json(updatedLoan);
  } catch (err) {
    console.error('updateLoanStatus error:', err.stack || err);
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({ message: err.message || 'Server error' });
  }
});

module.exports = {
  createLoan,
  getMyLoans,
  getAllLoans,
  getLoanStats, 
  getLoanById,
  updateLoanStatus,
};