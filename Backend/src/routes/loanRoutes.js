const express = require('express');
const router = express.Router();
const { createLoan, getAllLoans } = require('../controllers/loanController');

// POST /api/loans - Create a new loan request
router.post('/', createLoan);

// GET /api/loans - Get all loan requests
router.get('/', getAllLoans);

module.exports = router;