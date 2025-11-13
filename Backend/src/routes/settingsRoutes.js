const express = require('express');
const router = express.Router();
const {
  getInterestRate,
  updateInterestRate,
} = require('../controllers/settingsController');
const { protect } = require('../middlewares/authMiddleware');
const admin = require('../middlewares/roleMiddleware');

// GET /api/settings/rate (Public or private, for calculator)
router.get('/rate', getInterestRate);

// PUT /api/settings/rate (Admin only)
router.put('/rate', protect, admin, updateInterestRate);

module.exports = router;