import React, { useState, useEffect, useContext } from 'react'; 
import { useParams } from 'react-router-dom';
import { getLoanById } from '../api/loanApi';
import AuthContext from '../context/AuthContext'; 

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
const getPaymentStatusClasses = (status) => {
  if (status === 'paid') return 'bg-green-100 text-green-800';
  if (status === 'partial') return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-800'; 
};


const LoanDetails = () => {
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  
  const { user } = useContext(AuthContext); 

  const fetchLoan = async () => {
    try {
      setLoading(true);
      const { data } = await getLoanById(id);
      setLoan(data);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to fetch loan details.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchLoan();
    }
  }, [id]); 

  if (loading) {
    return <div className="text-center p-10">Loading loan details...</div>;
  }
  if (error) {
    return (
      <div className="text-center p-10 text-red-600" role="alert">
        {error}
      </div>
    );
  }
  if (!loan) {
    return <div className="text-center p-10">Loan not found.</div>;
  }

  const now = new Date();
  const overdueBalance = loan.repaymentSchedule
    .filter(
      (p) =>
        p.status === 'pending' &&
        new Date(p.dueDate) < now
    )
    .reduce((sum, p) => sum + (p.installment - p.amountPaid), 0);
  const totalPaid = loan.repaymentSchedule.reduce(
    (sum, p) => sum + p.amountPaid,
    0
  );
  const outstandingBalance = loan.amount - totalPaid;


  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Repayment Schedule
          </h1>
          <p className="text-gray-600 mt-2">
            Details for loan requested on {formatDate(loan.createdAt)}
          </p> 
        </div>
        
        
        {/* Loan Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">
              Total Amount
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(loan.amount)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">
              Overdue Balance
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(overdueBalance)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">
              Term
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {loan.termMonths} Months
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">
              Outstanding
            </div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(outstandingBalance)}
            </div>
          </div>
        </div>

        {/* Repayment Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Due
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loan.repaymentSchedule.map((payment) => {
                let statusLabel = 'Pending';
                let statusKey = 'pending';
                if (payment.status === 'paid') {
                    statusLabel = 'Paid';
                    statusKey = 'paid';
                } else if (payment.amountPaid > 0) {
                    statusLabel = 'Partial';
                    statusKey = 'partial';
                }

                return (
                  <tr key={payment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(payment.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(payment.installment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatCurrency(payment.amountPaid)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatCurrency(payment.interest)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatCurrency(payment.remainingBalance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusClasses(
                          statusKey
                        )}`}
                      >
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;