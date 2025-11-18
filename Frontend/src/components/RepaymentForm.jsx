import React, { useState } from 'react';
import { submitPayment } from '../api/paymentApi';

const RepaymentForm = ({ loanId, onPaymentSubmit }) => {
  const [amount, setAmount] = useState('');
  const [receipt, setReceipt] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await submitPayment({ loanId, amount, receipt });
      setSuccess('Payment submitted for review!');
      setAmount('');
      setReceipt('');
      
      if (onPaymentSubmit) {
        onPaymentSubmit();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount Paid
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 150.25"
            step="0.01"
            min="0.01"
          />
        </div>
        <div>
          <label
            htmlFor="receipt"
            className="block text-sm font-medium text-gray-700"
          >
            Receipt (URL or Confirmation #)
          </label>
          <input
            type="text"
            id="receipt"
            value={receipt}
            onChange={(e) => setReceipt(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., https://receipt.com/img123.png or #TXN12345"
          />
          <p className="text-xs text-gray-500 mt-1">
            Please provide a link or reference to your payment receipt.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-white font-semibold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {loading ? 'Submitting...' : 'Submit for Review'}
        </button>
      </form>
    </>
  );
};

export default RepaymentForm;