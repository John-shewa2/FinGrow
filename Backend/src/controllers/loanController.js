const Loan = require('../models/Loan');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

// Helper function to calculate repayment schedule
const calculateRepaymentSchedule = (amount, termMonths) => {
  const schedule = [];
  const interestRate = 0.05; // annual
  const monthlyInterest = (amount * interestRate) / 12;
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
    console.log('createLoan called - body:', req.body);
    console.log('createLoan - req.user:', req.user && { id: req.user._id, role: req.user.role });

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, no user information');
    }

    const { amount } = req.body;
    // accept multiple possible names from frontend and normalize to termMonths
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
      termMonths, // match required schema field
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
    ? {
        status: req.query.status, // Filter by status (pending, approved, rejected)
      }
    : {}; // No filter, get all

  const loans = await Loan.find({ ...status }).populate('borrower', 'username email');
  res.json(loans);
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
    // Check if user is the borrower OR an admin
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
    console.log('updateLoanStatus called - id:', req.params.id, 'body:', req.body, 'user:', req.user && { id: req.user._id, role: req.user.role });

    const { status } = req.body; // Expecting { status: 'approved' } or { status: 'rejected' }

    if (!status || (status !== 'approved' && status !== 'rejected')) {
      res.status(400);
      throw new Error('Invalid status');
    }

    // validate ObjectId format early
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

    loan.status = status;

    if (status === 'approved') {
      loan.repaymentSchedule = calculateRepaymentSchedule(loan.amount, loan.termMonths ?? loan.term);
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

