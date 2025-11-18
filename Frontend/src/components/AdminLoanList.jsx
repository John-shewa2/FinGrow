import React, { useState, useEffect } from 'react';
import { getAllLoans, updateLoanStatus } from '../api/loanApi'; 
import { Link } from 'react-router-dom';

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

const AdminLoanList = ({ status }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  

  // Function to fetch loans based on the status prop
  const fetchLoans = async () => {
    try {
      setLoading(true);
      const { data } = await getAllLoans(status);
      setLoans(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch loans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [status]); 

  const handleUpdateStatus = async (id, newStatus) => {
    setActionLoading(id);
    try {
      // API call is now simpler
      await updateLoanStatus(id, newStatus);
      fetchLoans();
    } catch (err) {
      console.error(`Failed to ${newStatus} loan:`, err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading loans...</div>;
  }
  if (error) {
    return (
      <div className="text-center p-8 text-red-600" role="alert">
        {error}
      </div>
    );
  }
  if (loans.length === 0) {
    return (
      <div className="text-center p-8 text-gray-600">
        No loans found with status: {status}.
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
              Term
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Requested On
            </th>
            {status !== 'pending' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate (%)
                </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loans.map((loan) => (
            <tr key={loan._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div>{loan.borrower?.username}</div>
                <div className="text-xs text-gray-500">
                  {loan.borrower?.email}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatCurrency(loan.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {loan.term} months
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(loan.createdAt)}
              </td>
              {status !== 'pending' && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {loan.interestRate}%
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                {status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(loan._id, 'approved')}
                      disabled={actionLoading === loan._id}
                      className="text-white font-semibold bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg shadow disabled:bg-gray-400"
                    >
                      {actionLoading === loan._id ? '...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(loan._id, 'rejected')}
                      disabled={actionLoading === loan._id}
                      className="text-white font-semibold bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg shadow disabled:bg-gray-400"
                    >
                      {actionLoading === loan._id ? '...' : 'Reject'}
                    </button>
                  </>
                )}
                {status !== 'pending' && (
                  <Link
                    to={`/loan/${loan._id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLoanList;