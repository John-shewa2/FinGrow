const Loan = require('../models/Loan');
const User = require('../models/user');
const Settings = require('../models/Settings'); // <-- 1. IMPORT SETTINGS
const asyncHandler = require('express-async-handler');

// Helper function to calculate repayment schedule
// *** MODIFIED: Renamed to 'generate' and uses decimal rate ***
const generateRepaymentSchedule = (amount, termMonths, annualRateDecimal) => {
  const schedule = [];

  const monthlyInterest = (amount * annualRateDecimal) / 12;
  const monthlyPrincipal = amount / termMonths;
  const monthlyPayment = monthlyPrincipal + monthlyInterest;

  const addMonths = (date, months) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  for (let i = 1; i <= termMonths; i++) {
    const dueDate = addMonths(new Date(), i); // approx monthly due date
    schedule.push({
      amount: parseFloat(monthlyPrincipal.toFixed(2)),   // principal portion
      installment: parseFloat(monthlyPayment.toFixed(2)),// total monthly payment
      dueDate,                                           // Date object
      // optional extra fields (not required by schema)
      interest: parseFloat(monthlyInterest.toFixed(2)),
      remainingBalance: parseFloat(Math.max(amount - monthlyPrincipal * i, 0).toFixed(2)),
    });
  }

  return schedule;
};

// @desc    Create new loan
// @route   POST /api/loans
// @access  Private (Borrower)
const createLoan = asyncHandler(async (req, res) => {
  try {
    // ... (This function remains the same as your last version)
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

// ... (getMyLoans, getAllLoans, getLoanById remain the same) ...
const getMyLoans = asyncHandler(async (req, res) => {
  const loans = await Loan.find({ borrower: req.user._id });
  res.json(loans);
});

const getAllLoans = asyncHandler(async (req, res) => {
  const status = req.query.status
    ? {
        status: req.query.status,
      }
    : {}; 

  const loans = await Loan.find({ ...status }).populate('borrower', 'username email');
  res.json(loans);
});

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
    // *** MODIFIED: Only get 'status' from body ***
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
    
    // Only update if status is changing
    if (loan.status === status) {
        return res.json(loan);
    }

    loan.status = status;

    if (status === 'approved') {
      // *** MODIFIED: Fetch the global rate on approval ***
      const settings = await Settings.getSettings();
      const currentRate = settings.interestRate;
      
      // Save this rate to the loan as a snapshot
      loan.interestRate = currentRate; 
      
      // Generate schedule using the global rate
      loan.repaymentSchedule = generateRepaymentSchedule(
        loan.amount, 
        loan.termMonths ?? loan.term, 
        currentRate / 100 // Pass as decimal
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
  getLoanById,
  updateLoanStatus,
};