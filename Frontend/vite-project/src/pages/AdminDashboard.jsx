import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { token, user } = useContext(AuthContext);
  const [loans, setLoans] = useState([]);

  // Fetch all loans
  const fetchLoans = async () => {
    try {
      const res = await api.get("/loans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token && user?.role === "admin") fetchLoans();
  }, [token, user]);

  // Approve a loan
  const handleApprove = async (id) => {
    try {
      await api.put(`/loans/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLoans(); // Refresh table after approval
    } catch (err) {
      console.error(err);
    }
  };

  // Reject a loan
  const handleReject = async (id) => {
    try {
      await api.put(`/loans/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLoans(); // Refresh table after rejection
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

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
                  <td className="border px-4 py-2">{loan.borrower.name}</td>
                  <td className="border px-4 py-2">{loan.amount}</td>
                  <td className="border px-4 py-2">{loan.termMonths}</td>
                  <td className="border px-4 py-2">{loan.interestRate}</td>
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
