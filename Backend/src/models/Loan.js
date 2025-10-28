const mongoose = require('mongoose');

// define the schema
const loanSchema = new mongoose.Schema(
    {
        borrower: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        interestRate: {
            type: Number,
            required: true,
            default: 7
        },
        termMonths: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'paid'],
            default: 'pending'
        },
        repaymentAmount: {
            type: Number,
            default: 0
        },
        pendingRepayment: {
            type: Number,
            default: 0
        }
    }, { timestamps: true }
);

// create the model
const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;