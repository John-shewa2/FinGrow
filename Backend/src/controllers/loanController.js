import Loan from '../models/Loan.js';
import User from '../models/user.js';
import asyncHandler from 'express-async-handler';

// Helper function to calculate repayment schedule
const calculateRepaymentSchedule = (amount, term) => {
  const schedule = [];
  // Simple interest calculation for this example
  // A real app would use a more complex amortization formula
  const interestRate = 0.05; // 5% annual interest
  const monthlyInterest = (amount * interestRate) / 12;
  const monthlyPrincipal = amount / term;
  const monthlyPayment = monthlyPrincipal + monthlyInterest;
  let remainingBalance = amount;

  for (let i = 1; i <= term; i++) {
    remainingBalance -= monthlyPrincipal;
    schedule.push({
      month: i,
      paymentDate: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000), // Approx.
      monthlyPayment: monthlyPayment.toFixed(2),
      principal: monthlyPrincipal.toFixed(2),
      interest: monthlyInterest.toFixed(2),
      remainingBalance: remainingBalance > 0 ? remainingBalance.toFixed(2) : 0,
    });
  }
  return schedule;
};

// @desc    Create new loan
// @route   POST /api/loans
// @access  Private (Borrower)
const createLoan = asyncHandler(async (req, res) => {
  const { amount, term } = req.body;

  if (!amount || !term) {
    res.status(400);
    throw new Error('Please provide an amount and a term');
  }

  const loan = new Loan({
    borrower: req.user._id, // Get user from protect middleware
    amount,
    term,
    status: 'pending', // Default status
  });

  const createdLoan = await loan.save();
  res.status(201).json(createdLoan);
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
  const { status } = req.body; // Expecting { status: 'approved' } or { status: 'rejected' }

  if (!status || (status !== 'approved' && status !== 'rejected')) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const loan = await Loan.findById(req.params.id);

  if (loan) {
    loan.status = status;

    // If approving, calculate and save the repayment schedule
    if (status === 'approved') {
      loan.repaymentSchedule = calculateRepaymentSchedule(
        loan.amount,
        loan.term
      );
    }

    const updatedLoan = await loan.save();
    res.json(updatedLoan);
  } else {
    res.status(404);
    throw new Error('Loan not found');
  }
});

// This is the most important part - exporting all functions as named exports
export {
  createLoan,
  getMyLoans,
  getAllLoans,
  getLoanById,
  updateLoanStatus,
};

