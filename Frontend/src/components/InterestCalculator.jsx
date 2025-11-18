import React, { useState, useEffect } from 'react';
import { getInterestRate } from '../api/settingsApi';

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
  const [totalInterest, setTotalInterest] = useState(0); 
  
  const [annualRate, setAnnualRate] = useState(7);
  const [rateLoading, setRateLoading] = useState(true);

  useEffect(() => {
    const fetchRate = async () => {
        try {
            setRateLoading(true);
            const { data } = await getInterestRate();
            setAnnualRate(data.interestRate || 7);
        } catch (err) {
            console.error("Failed to fetch rate, using default.", err);
            setAnnualRate(7); 
        } finally {
            setRateLoading(false);
        }
    };
    fetchRate();
  }, []);

  useEffect(() => {
    const principal = Number(amount);
    const termMonths = Number(term);
    const monthlyRate = (annualRate / 100) / 12;

    if (principal > 0 && termMonths > 0) {
      // Standard Amortization Formula
      // EMI = [P x r x (1+r)^n] / [(1+r)^n-1]
      
      let emi = 0;
      if (monthlyRate === 0) {
          // Edge case: 0% interest
          emi = principal / termMonths;
      } else {
          const pow = Math.pow(1 + monthlyRate, termMonths);
          emi = (principal * monthlyRate * pow) / (pow - 1);
      }

      const calculatedTotalRepayment = emi * termMonths;
      const calculatedTotalInterest = calculatedTotalRepayment - principal;

      setMonthlyPayment(emi);
      setTotalRepayment(calculatedTotalRepayment);
      setTotalInterest(calculatedTotalInterest);
    } else {
      setMonthlyPayment(0);
      setTotalRepayment(0);
      setTotalInterest(0);
    }
  }, [amount, term, annualRate]);

  return (
    <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Amortization Calculator
      </h3>
      
      <p className="text-sm text-gray-500 mb-4">
        {rateLoading 
            ? 'Loading current rate...' 
            : `Based on the current ${annualRate}% Annual Percentage Rate (APR).`
        }
      </p>
      
      <div className="space-y-4">
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

        <div className="pt-4 space-y-2 border-t border-gray-200 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Monthly Payment:</span>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(monthlyPayment)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Interest:</span>
            <span className="text-gray-800">
              {formatCurrency(totalInterest)}
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