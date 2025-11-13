import React from 'react';
import InterestCalculator from '../components/InterestCalculator';

const CalculatorPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Loan Calculator
          </h1>
          <InterestCalculator />
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;