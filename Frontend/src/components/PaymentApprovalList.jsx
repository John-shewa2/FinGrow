import React, { useState, useEffect } from 'react';
import {
  getPendingPayments,
  approvePayment,
  rejectPayment,
} from '../api/paymentApi';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'N/A';
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const PaymentApprovalList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); 

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data } = await getPendingPayments();
      setPayments(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAction = async (paymentId, action) => {
    setActionLoading(paymentId);
    try {
      if (action === 'approve') {
        await approvePayment(paymentId);
      } else {
        await rejectPayment(paymentId);
      }
      // Refresh the list
      fetchPayments();
    } catch (err) {
      console.error('Failed to process payment:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading pending payments...</div>;
  }
  if (error) {
    return (
      <div className="text-center p-8 text-red-600" role="alert">
        {error}
      </div>
    );
  }
  if (payments.length === 0) {
    return (
      <div className="text-center p-8 text-gray-600">
        No pending payments found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Borrower
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted On
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Receipt
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div>{payment.borrower?.name}</div>
                <div className="text-xs text-gray-500">
                  {payment.borrower?.email}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatCurrency(payment.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(payment.submittedAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {/* Basic link for receipt URL. */}
                <a
                  href={payment.receipt.startsWith('http') ? payment.receipt : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {payment.receipt}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => handleAction(payment._id, 'approve')}
                  disabled={actionLoading === payment._id}
                  className="text-white font-semibold bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg shadow disabled:bg-gray-400"
                >
                  {actionLoading === payment._id ? '...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleAction(payment._id, 'reject')}
                  disabled={actionLoading === payment._id}
                  className="text-white font-semibold bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg shadow disabled:bg-gray-400"
                >
                  {actionLoading === payment._id ? '...' : 'Reject'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentApprovalList;