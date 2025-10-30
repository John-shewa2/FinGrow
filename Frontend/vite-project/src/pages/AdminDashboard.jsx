import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom"; // ✅ You were missing this
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { token, user, logout, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />; // ✅ Ensure only admins view this

  const [loans, setLoans] = useState([]);

  const fetchLoans = async () => {
    try {
      const res = await api.get("/loans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📌 Loans from backend:", res.data); // <--- ADD THIS
      console.log("👤 Logged-in user:", user);
      setLoans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/loans/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLoans();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/loans/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLoans();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <header className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <nav>
      <button
            className="text-red-600"
            onClick={logout}
          >
            Logout
          </button>
        </nav>
        </header>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">All Loan Requests</h2>

        {loans.length === 0 ? (
          <p>No loan requests yet</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Borrower</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Term</th>
                <th className="border px-4 py-2">Interest</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan._id} className="text-center">
                  <td className="border px-4 py-2">
                    {loan.borrower?.name || "Unknown"}
                  </td>
                  <td className="border px-4 py-2">{loan.amount}</td>
                  <td className="border px-4 py-2">{loan.termMonths}</td>
                  <td className="border px-4 py-2">{loan.interestRate}%</td>
                  <td className="border px-4 py-2">{loan.status}</td>
                  <td className="border px-4 py-2 space-x-2">
                    {loan.status === "pending" && (
                      <>
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded"
                          onClick={() => handleApprove(loan._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded"
                          onClick={() => handleReject(loan._id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
