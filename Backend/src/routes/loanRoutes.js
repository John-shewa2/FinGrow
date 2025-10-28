const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const { createLoan, getAllLoans, approveLoan, rejectLoan, requestRepayment, approveRepayment } = require('../controllers/loanController');

const router = require('express').Router();

// Borrower creates loan
router.post('/', protect, createLoan);

// Admin can see all loans
router.get('/', protect, authorizeRoles('admin'), getAllLoans);

// Admin approves/rejects loans
router.put('/:id/approve', protect, authorizeRoles('admin'), approveLoan);
router.put('/:id/reject', protect, authorizeRoles('admin'), rejectLoan);

// Borrower requests repayment
router.post('/:id/request-repayment', protect, requestRepayment);

// Admin approves repayment
router.put('/:id/approve-repayment', protect, authorizeRoles('admin'), approveRepayment);

module.exports = router;
