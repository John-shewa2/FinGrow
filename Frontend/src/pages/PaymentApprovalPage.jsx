import React from 'react';
import PaymentApprovalList from '../components/PaymentApprovalList';

const PaymentApprovalPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Payment Approvals
          </h1>
          <p className="text-gray-600 mt-2">
            Review and approve or reject borrower payment submissions.
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <PaymentApprovalList />
        </div>
      </div>
    </div>
  );
};

export default PaymentApprovalPage;