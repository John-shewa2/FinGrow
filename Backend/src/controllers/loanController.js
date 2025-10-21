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

module.exports = {
    createLoan,
    getAllLoans,
};