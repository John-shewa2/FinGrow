import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Loans from "../pages/Loans";
import AdminDashboard from "../pages/AdminDashboard";
import { AuthContext } from "../context/AuthContext";

export default function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/loans" /> : <Navigate to="/login" />} 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/loans" element={user ? <Loans /> : <Navigate to="/login" />} />
        <Route
          path="/admin"
          element={user && user.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}
