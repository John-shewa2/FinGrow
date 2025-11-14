const express = require('express');
const router = express.Router();
const {
  submitPayment,
  getPendingPayments,
  approvePayment,
  rejectPayment,
} = require('../controllers/paymentController');

const { protect } = require('../middlewares/authMiddleware');
const admin = require('../middlewares/roleMiddleware');

// Borrower route
router.route('/').post(protect, submitPayment);

// Admin routes
router.route('/pending').get(protect, admin, getPendingPayments);
router.route('/:id/approve').put(protect, admin, approvePayment);
router.route('/:id/reject').put(protect, admin, rejectPayment);

module.exports = router;