import React, { useState, useEffect } from 'react'; 
import { getMyLoans } from '../api/loanApi'; 
import { Link } from 'react-router-dom';

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper function to format currency
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'N/A';
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Helper to style the status
const getStatusClasses = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'paid':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};


const MyLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const { data } = await getMyLoans();
        setLoans(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch loans.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading your loans...</div>;
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
        You have not requested any loans.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Loan History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Outstanding
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loans.map((loan) => {
              // --- Calculation Logic ---
              let outstandingBalance = 0;
              let nextPaymentDate = null;

              if (loan.status === 'approved' && loan.repaymentSchedule?.length > 0) {
                const nextPayment = loan.repaymentSchedule.find(
                  (p) => p.status === 'pending'
                );
                nextPaymentDate = nextPayment ? nextPayment.dueDate : null;
                
                const lastPaidPayment = [...loan.repaymentSchedule]
                  .reverse()
                  .find((p) => p.status === 'paid');
                
                const totalPaid = loan.repaymentSchedule.reduce(
                  (sum, p) => sum + p.amountPaid,
                  0
                );
                outstandingBalance = loan.amount - totalPaid;

              } else if (loan.status === 'paid') {
                outstandingBalance = 0;
                nextPaymentDate = null;
              }
              // --- End of Calculation Logic ---

              return (
                <tr key={loan._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(loan.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                        loan.status
                      )}`}
                    >
                      {loan.status.charAt(0).toUpperCase() +
                        loan.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatCurrency(outstandingBalance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(nextPaymentDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {(loan.status === 'approved' ||
                      loan.status === 'paid') && (
                      <Link
                        to={`/loan/${loan._id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Repayment Schedule
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyLoans;