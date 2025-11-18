import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-indigo-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-white">
              FinGrow
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {isAuthenticated ? (
              <>
                {/* Role-based dashboard link */}
                {user?.role === 'admin' ? (
                  <>
                    <Link
                      to="/admin"
                      className="text-white hover:text-gray-100 font-medium transition duration-150"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/payments"
                      className="text-white hover:text-gray-100 font-medium transition duration-150"
                    >
                      Payment Approvals
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="text-white hover:text-gray-100 font-medium transition duration-150"
                    >
                      Settings
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-white hover:text-gray-100 font-medium transition duration-150"
                    >
                      My Dashboard
                    </Link>
                    <Link
                      to="/submit-payment"
                      className="text-white hover:text-gray-100 font-medium transition duration-150"
                    >
                      Submit Payment
                    </Link>
                  </>
                )}

                <Link
                  to="/calculator"
                  className="text-white hover:text-gray-100 font-medium transition duration-150"
                >
                  Calculator
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-white text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition duration-150"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/calculator"
                  className="text-white hover:text-gray-100 font-medium transition duration-150"
                >
                  Calculator
                </Link>
                <Link
                  to="/login"
                  className="text-white hover:text-gray-100 font-medium transition duration-150"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition duration-150"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;