const mongoose = require('mongoose');

// define the schema
const repaymentSchema = new mongoose.Schema(
    {
        installment: {
            type: Number,
            required: true
        },
        dueDate: {
            type: Date,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'paid'],
            default: 'pending'
        }
    }
);

const loanSchema = new mongoose.Schema(
    {
        borrower: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required:[ true, 'Please enter loan amount' ]
        },
        interestRate: {
            type: Number,
            required: true,
            default: 7 // This will be used on creation
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
       
        repaymentSchedule: [repaymentSchema],

        totalInterest: {
            type: Number,
        },
        totalRepayable: {
            type: Number,
        },
        NextDueDate: {
            type: Date,
        },
        OutstandingBalance: {
            type: Number,
        }
        
    }, { timestamps: true }
);

// create the model
const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;