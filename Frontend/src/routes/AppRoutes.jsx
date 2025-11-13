import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from '../pages/Dashboard';
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/AdminDashboard";
import LoanDetails from "../pages/LoanDetails";
import Navbar from "../components/Navbar";
import AuthContext from "../context/AuthContext";
import { ProtectedRoute, AdminRoute } from "./ProtectedRoutes";
import CalculatorPage from "../pages/CalculatorPage"; // <-- 1. IMPORT IT

const AppRoutes = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  /**
   * This component handles the root path ('/').
   * If logged in, it redirects to the correct dashboard based on role.
   * If not logged in, it redirects to login.
   */
  const HomeRedirect = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return user?.role === 'admin' ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/dashboard" replace />
    );
  };

  return (
    <Router>
      <Navbar /> {/* Assuming Navbar has logic to show/hide links based on auth */}
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/calculator" element={<CalculatorPage />} /> {/* <-- 2. ADD THE ROUTE */}

        {/* --- Protected Borrower Routes --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/loan/:id" element={<LoanDetails />} /> 
          {/* This will be the "Repayment Schedule" page */}
        </Route>

        {/* --- Protected Admin Routes --- */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;