import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";

export default function Loans() {
  const { token, user, logout } = useContext(AuthContext);
  const [loans, setLoans] = useState([]);
  const [amount, setAmount] = useState("");
  const [termMonths, setTermMonths] = useState("");
  const [interestRate, setInterestRate] = useState(7);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showLoans, setShowLoans] = useState(false); 

  const fetchLoans = async () => {
    try {
      const res = await api.get("/loans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("GET /loans response:", res.data); 
      if (user.role === "admin") {
        setLoans(res.data);
      } else {
        setLoans(
          res.data.filter((l) => {
            const borrowerId = l.borrower?._id || l.borrower;
            const userId = user._id || user.id;
            return String(borrowerId) === String(userId);
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchLoans();
  }, [token]);
  const handleShowLoans = async () => {
    setShowLoans(true);
    await fetchLoans();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post(
        "/loans",
        { amount, termMonths },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Loan request submitted!");
      setAmount("");
      setTermMonths("");
      fetchLoans();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create loan");
    }
  };
  // Admin view
  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Hello, {user.name}
        </h1>
        <nav>
          {user.role === "borrower" && (
            <button
              className="mr-4 text-blue-600"
              onClick={handleShowLoans}
            >
              My Loans
            </button>
          )}
          <button
            className="text-red-600"
            onClick={logout}
          >
            Logout
          </button>
        </nav>
      </header>

      {user.role === "borrower" && (
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Request a Loan</h2>
          {error && <p className="text-red-600 mb-3">{error}</p>}
          {success && <p className="text-green-600 mb-3">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="number"
              placeholder="Amount"
              className="w-full p-3 border rounded"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Term (months)"
              className="w-full p-3 border rounded"
              value={termMonths}
              onChange={(e) => setTermMonths(e.target.value)}
              required
            />
            <input
              type="number"
              value={interestRate}
              readOnly
              className="w-full p-3 border rounded bg-gray-100 text-gray-600"
              placeholder="Interest rate (%)"
            />
            <button className="w-full p-3 bg-green-600 text-white rounded">
              Submit Loan Request
            </button>
          </form>
        </div>
      )}

      {showLoans && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Loan Status</h2>
          {loans.length === 0 ? (
            <p>No loans yet</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2">Term</th>
                  <th className="border px-4 py-2">Interest</th>
                  <th className="border px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan._id} className="text-center">
                    <td className="border px-4 py-2">{loan.amount}</td>
                    <td className="border px-4 py-2">{loan.termMonths}</td>
                    <td className="border px-4 py-2">{loan.interestRate}</td>
                    <td className="border px-4 py-2">{loan.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
