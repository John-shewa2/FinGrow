import React, { useState, useContext, useEffect } from 'react';
import LoanRequestForm from '../components/LoanRequestForm';
import { useLocation } from 'react-router-dom'; 
import MyLoans from '../components/MyLoans'; 
import AuthContext from '../context/AuthContext';


const Dashboard = () => {
  // State to manage which view is active: 'myLoans' or 'requestLoan'
  const [activeView, setActiveView] = useState('myLoans');
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    if (location.state && location.state.message) {
      setSuccessMessage(location.state.message);

      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  const firstName =
    user?.name?.split(' ')[0] || user?.username || 'User';

  const getButtonClasses = (viewName) => {
    return activeView === viewName
      ? 'bg-blue-600 text-white'
      : 'bg-white text-gray-800 hover:bg-gray-100';
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome {firstName}
          </h1>
          <p className="text-gray-600 mt-2">
            Borrower Dashboard — manage your loans or request a new one.
          </p>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveView('myLoans')}
            className={`px-6 py-3 font-semibold rounded-lg shadow-md transition duration-200 ${getButtonClasses(
              'myLoans'
            )}`}
          >
            My Loans
          </button>
          
          <button
            onClick={() => setActiveView('requestLoan')}
            className={`px-6 py-3 font-semibold rounded-lg shadow-md transition duration-200 ${getButtonClasses(
              'requestLoan'
            )}`}
          >
            Request New Loan
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {activeView === 'myLoans' ? <MyLoans /> : <LoanRequestForm />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;