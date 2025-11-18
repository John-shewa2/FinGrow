const Payment = require('../models/Payment');
const Loan = require('../models/Loan');
const asyncHandler = require('express-async-handler');

// @desc    Submit a new payment for review
// @route   POST /api/payments
// @access  Private (Borrower)
const submitPayment = asyncHandler(async (req, res) => {
  const { loanId, amount, receipt } = req.body;

  if (!loanId || !amount || !receipt) {
    res.status(400);
    throw new Error('Please provide loanId, amount, and receipt');
  }

  const loan = await Loan.findById(loanId);
  if (!loan) {
    res.status(404);
    throw new Error('Loan not found');
  }
  if (loan.borrower.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to make payments on this loan');
  }

  const payment = new Payment({
    loan: loanId,
    borrower: req.user._id,
    amount: Number(amount),
    receipt, // This is just a string (URL/name)
    status: 'pending',
  });

  const createdPayment = await payment.save();
  res.status(201).json(createdPayment);
});

// @desc    Get all pending payments
// @route   GET /api/payments/pending
// @access  Private (Admin)
const getPendingPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ status: 'pending' })
    .populate('borrower', 'name email')
    .populate('loan', 'amount');
  res.json(payments);
});

// @desc    Approve a payment
// @route   PUT /api/payments/:id/approve
// @access  Private (Admin)
const approvePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }
  if (payment.status !== 'pending') {
    res.status(400);
    throw new Error(`Payment is already ${payment.status}`);
  }

  const loan = await Loan.findById(payment.loan);
  if (!loan) {
    res.status(404);
    throw new Error('Associated loan not found');
  }

  let amountToApply = payment.amount;

  // 1. Apply to any existing 'advanceCredit' first
  // This handles a rare case where a user pays *less* than their advance
  if (loan.advanceCredit < 0) {
      const creditToClear = Math.min(amountToApply, Math.abs(loan.advanceCredit));
      loan.advanceCredit += creditToClear;
      amountToApply -= creditToClear;
  }

  // 2. Apply payment to installments (oldest pending first)
  for (const installment of loan.repaymentSchedule.sort((a,b) => a.dueDate - b.dueDate)) {
    if (installment.status === 'pending' && amountToApply > 0) {
      const amountDue = installment.installment - installment.amountPaid;
      
      if (amountToApply >= amountDue) {
        // Payment covers this installment
        amountToApply -= amountDue;
        installment.amountPaid = installment.installment;
        installment.status = 'paid';
      } else {
        // Payment partially covers this installment
        installment.amountPaid += amountToApply;
        amountToApply = 0;
        break; // Stop applying, amount is used up
      }
    }
  }

  // 3. Any remaining amount is stored as advance credit
  if (amountToApply > 0) {
    loan.advanceCredit += amountToApply;
  }

  // 4. Mark payment as approved
  payment.status = 'approved';
  payment.reviewedAt = Date.now();

  await loan.save();
  await payment.save();

  res.json({ message: 'Payment approved and applied', loan });
});

// @desc    Reject a payment
// @route   PUT /api/payments/:id/reject
// @access  Private (Admin)
const rejectPayment = asyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
        res.status(404);
        throw new Error('Payment not found');
    }
    payment.status = 'rejected';
    payment.reviewedAt = Date.now();
    await payment.save();
    res.json({ message: 'Payment rejected' });
});

module.exports = {
  submitPayment,
  getPendingPayments,
  approvePayment,
  rejectPayment
};