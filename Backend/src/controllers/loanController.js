const Loan = require('../models/Loan');

// Create a new loan request
const createLoan = async (req, res) => {
    try {
        const { borrower, amount, interestRate, termMonths } = req.body;

        const loan = new Loan({
            borrower,
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

// Get all loans
const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find().populate('borrower', 'name email');
        res.json(loans);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Approve a loan request
const approveLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        loan.status = 'approved';
        await loan.save();
        res.json({ message: 'Loan approved successfully', loan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Reject a loan request
const rejectLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        loan.status = 'rejected';
        await loan.save();
        res.json({ message: 'Loan rejected successfully', loan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Repay loan
const repayLoan = async (req, res) => {
    try {
        const { amount } = req.body;
        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        if (loan.status !== 'approved') {
            return res.status(400).json({ message: 'Only approved loans can be repaid' });
        }
        // update repayment amount
        loan.repaymentAmount += amount;

        // if fully paid, mark as paid
        const totalDue = loan.amount + (loan.amount * loan.interestRate / 100);
        if (loan.repaymentAmount >= totalDue) {
            loan.status = 'Paid';
            loan.repaymentAmount = totalDue; // cap repayment to total due
        }

        await loan.save();
        res.json({ message: 'Loan repayment successful', loan });

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
    repayLoan
};