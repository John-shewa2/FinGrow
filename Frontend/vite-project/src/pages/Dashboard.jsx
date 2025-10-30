import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  // Redirect to login if not logged in
  if (loading) return <p>Loading...</p>; // <-- wait for auth state
  if (!user) return <Navigate to="/login" />; // <-- redirect only if not logged in

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Fingrow Dashboard</h1>
        <nav>
          <Link className="text-blue-600 mr-4" to="/loans">My Loans</Link>
          <span className="mr-4">Hello, {user.name}</span>
          <button
            className="text-red-600"
            onClick={logout}
          >
            Logout
          </button>
        </nav>
      </header>

      <main>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Welcome to Fingrow</h2>
          <p className="text-sm text-gray-600">
            You are logged in as <strong>{user.role}</strong>.
          </p>
        </div>
      </main>
    </div>
  );
}
