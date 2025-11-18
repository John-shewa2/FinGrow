import React, { useState } from 'react';
import AdminLoanList from '../components/AdminLoanList';
import KpiDashboard from '../components/KpiDashboard';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('pending');

  const getButtonClasses = (viewName) => {
    return activeView === viewName
      ? 'bg-blue-600 text-white'
      : 'bg-white text-gray-800 hover:bg-gray-100';
  };
  
  const renderActiveView = () => {
    switch (activeView) {
      case 'pending':
        return <AdminLoanList key="pending" status="pending" />;
      case 'approved':
        return <AdminLoanList key="approved" status="approved" />;
      case 'rejected':
        return <AdminLoanList key="rejected" status="rejected" />;
      default:
        return <AdminLoanList key="pending" status="pending" />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            View loan statistics and manage all loan applications.
          </p>
        </div>

        <KpiDashboard />

        {/* View Toggle Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveView('pending')}
            className={`px-6 py-3 font-semibold rounded-lg shadow-md transition duration-200 ${getButtonClasses(
              'pending'
            )}`}
          >
            Pending Requests
          </button>
          <button
            onClick={() => setActiveView('approved')}
            className={`px-6 py-3 font-semibold rounded-lg shadow-md transition duration-200 ${getButtonClasses(
              'approved'
            )}`}
          >
            Approved Loans
          </button>
          <button
            onClick={() => setActiveView('rejected')}
            className={`px-6 py-3 font-semibold rounded-lg shadow-md transition duration-200 ${getButtonClasses(
              'rejected'
            )}`}
          >
            Rejected Loans
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;