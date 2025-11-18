import React, { useState, useEffect } from 'react';
import RepaymentForm from '../components/RepaymentForm';
import { getMyLoans } from '../api/loanApi';

const SubmitPaymentPage = () => {
  const [approvedLoans, setApprovedLoans] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const { data } = await getMyLoans();
        // Filter for only loans that can be paid (i.e., 'approved')
        const activeLoans = data.filter(loan => loan.status === 'approved');
        setApprovedLoans(activeLoans);
        setError(null);
        // If there's only one active loan, auto-select it
        if (activeLoans.length === 1) {
          setSelectedLoanId(activeLoans[0]._id);
        }
      } catch (err) {
        setError('Failed to fetch your active loans.');
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []); 

  const handleSelectChange = (e) => {
    setSelectedLoanId(e.target.value);
  };
  
  const handlePaymentSuccess = () => {
     // Reset the form by clearing the selection
     setSelectedLoanId(''); 
  };

  if (loading) {
    return <div className="text-center p-10">Loading your loans...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Submit a Payment
          </h1>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          
          {/* Check if user has any loans to pay */}
          {approvedLoans.length > 0 ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="loanSelect" className="block text-sm font-medium text-gray-700">
                  1. Select Your Loan
                </label>
                <select
                  id="loanSelect"
                  value={selectedLoanId}
                  onChange={handleSelectChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Please select a loan --</option>
                  {approvedLoans.map(loan => (
                    <option key={loan._id} value={loan._id}>
                      Loan for {formatCurrency(loan.amount)} (Approved: {new Date(loan.updatedAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Only show the form if a loan is selected */}
              {selectedLoanId && (
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                    2. Enter Payment Details
                    </p>
                    <RepaymentForm 
                    loanId={selectedLoanId} 
                    onPaymentSubmit={handlePaymentSuccess} 
                    />
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600 text-center">
              You do not have any approved loans eligible for payment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0.00';
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default SubmitPaymentPage;