import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Loans() {
  const { token, user } = useContext(AuthContext);
  const [loans, setLoans] = useState([]);
  const [amount, setAmount] = useState("");
  const [termMonths, setTermMonths] = useState("");
  const [interestRate, setInterestRate] = useState(7);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    if (token) fetchLoans();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await api.post(
        "/loans",
        {
          borrower: user.id,
          amount,
          termMonths,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Loan request submitted!");
      setAmount("");
      setTermMonths("");
      fetchLoans(); // refresh loan list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create loan");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">My Loans</h1>

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
    
    {/* Display interest rate read-only */}
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
    </div>
  );
}
