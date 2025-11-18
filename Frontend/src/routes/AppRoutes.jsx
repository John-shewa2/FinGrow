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
import CalculatorPage from "../pages/CalculatorPage";
import PaymentApprovalPage from "../pages/PaymentApprovalPage";
import SettingsPage from "../pages/SettingsPage";
import SubmitPaymentPage from "../pages/SubmitPaymentPage"; 

const AppRoutes = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  const HomeRedirect = () => {
    return <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/calculator" element={<CalculatorPage />} /> 

        {/* --- Protected Borrower Routes --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/loan/:id" element={<LoanDetails />} /> 
          <Route path="/submit-payment" element={<SubmitPaymentPage />} /> {/* <-- 2. ADD ROUTE */}
        </Route>

        {/* --- Protected Admin Routes --- */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/payments" element={<PaymentApprovalPage />} /> 
          <Route path="/admin/settings" element={<SettingsPage />} /> 
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;