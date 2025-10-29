import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/users/login", formData);
      console.log(res.data);

      // Store token in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to dashboard
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6">Login to Fingrow</h1>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded mb-3"
            type="email"
            placeholder="Email"
            required
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded mb-3"
            type="password"
            placeholder="Password"
            required
          />
          <button className="w-full p-3 bg-blue-600 text-white rounded">
            Login
          </button>
        </form>

        <p className="text-sm mt-4">
          Don&apos;t have an account?{" "}
          <Link className="text-green-600" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

