const express = require('express');
const {
  createLoan,
  getMyLoans,
  getAllLoans,
  getLoanById,
  updateLoanStatus,
} = require('../controllers/loanController');

const { protect } = require('../middlewares/authMiddleware');
const admin = require('../middlewares/roleMiddleware');

const router = express.Router();

// --- Combined '/' Routes ---
router
  .route('/')
  .post(protect, createLoan)
  .get(protect, admin, getAllLoans);

// --- Borrower Route ---
router.route('/myloans').get(protect, getMyLoans);

// --- Shared & Admin-Specific ID Routes ---
router.route('/:id').get(protect, getLoanById);

// PUT /api/loans/:id/status (Admin: Approve/Reject a loan)
router.route('/:id/status')
  .put(protect, admin, updateLoanStatus)
  .patch(protect, admin, updateLoanStatus);

module.exports = router;


