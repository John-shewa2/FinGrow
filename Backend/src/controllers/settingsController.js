const Settings = require('../models/Settings');
const Loan = require('../models/Loan');
const asyncHandler = require('express-async-handler');

// Recalculate interest and revise monthly payment amount
const recalculateActiveLoans = async (newRate) => {
  const newRateDecimal = newRate / 100;

  try {
    const activeLoans = await Loan.find({ status: 'approved' });

    for (const loan of activeLoans) {
      // Recalculate monthly payment based on new rate
      const monthlyInterest = (loan.amount * newRateDecimal) / 12;
      const monthlyPrincipal = loan.amount / loan.termMonths;
      const newMonthlyPayment = monthlyPrincipal + monthlyInterest;

      // Update the loan's stored interest rate
      loan.interestRate = newRate;

      // Update all PENDING installments
      let hasPending = false;
      loan.repaymentSchedule.forEach((installment) => {
        if (installment.status === 'pending') {
          installment.installment = parseFloat(newMonthlyPayment.toFixed(2));
          installment.amount = parseFloat(monthlyPrincipal.toFixed(2));
          hasPending = true;
        }
      });

      // If loan is fully paid, skip saving. Otherwise, save changes.
      if (hasPending) {
        await loan.save();
      }
    }
    console.log(`Recalculated ${activeLoans.length} active loans.`);
  } catch (error) {
    console.error('Error during loan recalculation:', error);
  }
};

// @desc    Get the global interest rate
// @route   GET /api/settings/rate
// @access  Public
const getInterestRate = asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings();
  res.json({ interestRate: settings.interestRate });
});

// @desc    Update the global interest rate and recalculate loans
// @route   PUT /api/settings/rate
// @access  Admin
const updateInterestRate = asyncHandler(async (req, res) => {
  const { interestRate } = req.body;

  if (interestRate === null || interestRate === undefined || interestRate < 0) {
    res.status(400);
    throw new Error('Invalid interest rate');
  }

  const settings = await Settings.getSettings();
  settings.interestRate = Number(interestRate);
  await settings.save();

  recalculateActiveLoans(settings.interestRate);

  res.json({
    message: 'Interest rate updated. Recalculation started.',
    interestRate: settings.interestRate,
  });
});

module.exports = {
  getInterestRate,
  updateInterestRate,
};