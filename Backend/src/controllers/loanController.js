const Loan = require('../models/Loan');

// Create a new loan request (borrower)
const createLoan = async (req, res) => {
    try {
        const { amount, interestRate, termMonths } = req.body;

        const loan = new Loan({
            borrower: req.user._id,
            amount,
            interestRate,
            termMonths
        });
        await loan.save();

        res.status(201).json({
            message: 'Loan request created successfully',
            loan
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all loans (admin)
const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find().populate('borrower', 'name email role');
        res.json(loans);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get loans for the logged-in borrower
const getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ borrower: req.user._id });
    res.json(loans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve loan request (admin)
const approveLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) return res.status(404).json({ message: 'Loan not found' });

        loan.status = 'approved';
        await loan.save();

        res.json({ message: 'Loan approved successfully', loan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Reject loan request (admin)
const rejectLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) return res.status(404).json({ message: 'Loan not found' });

        loan.status = 'rejected';
        await loan.save();

        res.json({ message: 'Loan rejected successfully', loan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Borrower submits repayment request
const requestRepayment = async (req, res) => {
    try {
        const { amount } = req.body;
        const loan = await Loan.findById(req.params.id);

        if (!loan) return res.status(404).json({ message: 'Loan not found' });
        if (!loan.borrower.equals(req.user._id)) return res.status(403).json({ message: 'Not your loan' });
        if (loan.status !== 'approved') return res.status(400).json({ message: 'Only approved loans can have repayments' });

        loan.pendingRepayment += amount;
        await loan.save();

        res.json({
            message: 'Repayment request submitted, pending admin approval',
            loan
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Admin approves a repayment
const approveRepayment = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) return res.status(404).json({ message: 'Loan not found' });
        if (loan.pendingRepayment <= 0) return res.status(400).json({ message: 'No pending repayment to approve' });

        loan.repaymentAmount += loan.pendingRepayment;
        loan.pendingRepayment = 0;

        // Check if fully paid
        const totalDue = loan.amount + (loan.amount * loan.interestRate / 100);
        if (loan.repaymentAmount >= totalDue) {
            loan.status = 'paid';
            loan.repaymentAmount = totalDue; // cap repayment
        }

        await loan.save();

        res.json({
            message: 'Repayment approved and applied to loan',
            loan
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createLoan,
    getAllLoans,
    approveLoan,
    rejectLoan,
    requestRepayment,
    approveRepayment,
    getMyLoans,
};
