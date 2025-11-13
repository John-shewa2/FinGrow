import React, { useState, useEffect } from 'react';
import { getInterestRate } from '../api/settingsApi'; // <-- 1. IMPORT

// const ANNUAL_INTEREST_RATE = 0.07; // <-- No longer hardcoded

const formatCurrency = (amount) => {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const InterestCalculator = () => {
  const [amount, setAmount] = useState(1000);
  const [term, setTerm] = useState(12);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalRepayment, setTotalRepayment] = useState(0);
  
  // *** MODIFIED: State to hold the fetched rate ***
  const [annualRate, setAnnualRate] = useState(7); // Default to 7
  const [rateLoading, setRateLoading] = useState(true);

  useEffect(() => {
    // *** MODIFIED: Fetch the rate from the API ***
    const fetchRate = async () => {
        try {
            setRateLoading(true);
            const { data } = await getInterestRate();
            setAnnualRate(data.interestRate || 7);
        } catch (err) {
            console.error("Failed to fetch rate, using default.", err);
            setAnnualRate(7); // Fallback
        } finally {
            setRateLoading(false);
        }
    };
    fetchRate();
  }, []);

  useEffect(() => {
    const principal = Number(amount);
    const termMonths = Number(term);
    
    // *** MODIFIED: Use the 'annualRate' from state ***
    const rateDecimal = annualRate / 100;

    if (principal > 0 && termMonths > 0) {
      const monthlyInterest = (principal * rateDecimal) / 12;
      const monthlyPrincipal = principal / termMonths;
      const calculatedMonthlyPayment = monthlyPrincipal + monthlyInterest;
      const calculatedTotalRepayment = calculatedMonthlyPayment * termMonths;

      setMonthlyPayment(calculatedMonthlyPayment);
      setTotalRepayment(calculatedTotalRepayment);
    } else {
      setMonthlyPayment(0);
      setTotalRepayment(0);
    }
  }, [amount, term, annualRate]); // <-- 3. Add annualRate to dependency array

  return (
    <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Estimate Your Payments
      </h3>
      
      {/* *** MODIFIED: Show the dynamic rate *** */}
      <p className="text-sm text-gray-500 mb-4">
        {rateLoading 
            ? 'Loading current rate...' 
            : `Based on current ${annualRate}% annual flat rate. Admins may adjust this rate upon review.`
        }
      </p>
      
      <div className="space-y-4">
        {/* ... (Inputs remain the same) ... */}
        <div>
          <label
            htmlFor="calc-amount"
            className="block text-sm font-medium text-gray-700"
          >
            Loan Amount
          </label>
          <input
            type="number"
            id="calc-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            min="100"
          />
        </div>

        <div>
          <label
            htmlFor="calc-term"
            className="block text-sm font-medium text-gray-700"
          >
            Loan Term (in months)
          </label>
          <input
            type="number"
            id="calc-term"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            min="1"
          />
        </div>

        {/* ... (Results display remains the same) ... */}
        <div className="pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Monthly Payment:</span>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(monthlyPayment)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">
              Total Repayment:
            </span>
            <span className="text-lg font-semibold text-gray-800">
              {formatCurrency(totalRepayment)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestCalculator;