const express = require('express');
const router = express.Router();
const { createLoan, getAllLoans, approveLoan, rejectLoan, repayLoan } = require('../controllers/loanController');

// POST /api/loans - Create a new loan request
router.post('/', createLoan);

// GET /api/loans - Get all loan requests
router.get('/', getAllLoans);

// Approve loan
router.put('/:id/approve', approveLoan);

// Reject loan
router.put('/:id/reject', rejectLoan);

// Repay loan
router.post('/:id/repay', repayLoan);

module.exports = router;