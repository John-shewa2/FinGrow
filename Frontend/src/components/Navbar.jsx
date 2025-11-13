import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md sticky top-0 z-50">
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
                  <Link
                    to="/admin"
                    className="text-white hover:text-gray-100 font-medium transition duration-150"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="text-white hover:text-gray-100 font-medium transition duration-150"
                  >
                    My Dashboard
                  </Link>
                )}

                {/* ADDED CALCULATOR LINK for logged-in users */}
                <Link
                  to="/calculator"
                  className="text-white hover:text-gray-100 font-medium transition duration-150"
                >
                  Loan Calculator
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition duration-150"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* ADDED CALCULATOR LINK for logged-out users */}
                <Link
                  to="/calculator"
                  className="text-white hover:text-gray-100 font-medium transition duration-150"
                >
                  Loan Calculator
                </Link>

                {/* Links for logged-out users */}
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

          {/* Mobile Menu Button (Optional - not implemented) */}
          <div className="md:hidden">
            {/* You could add a hamburger menu icon here */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;