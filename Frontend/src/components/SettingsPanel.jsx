import React, { useState, useEffect } from 'react';
import { getInterestRate, updateInterestRate } from '../api/settingsApi';

const SettingsPanel = () => {
  const [rate, setRate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Fetch the current rate on load
    const fetchRate = async () => {
      try {
        const { data } = await getInterestRate();
        setRate(data.interestRate);
      } catch (err) {
        setError('Failed to load current rate.');
      }
    };
    fetchRate();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { data } = await updateInterestRate(rate);
      setSuccess(data.message || 'Rate updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update rate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Interest Rate Settings
      </h2>

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex items-end space-x-4">
        <div className="flex-grow">
          <label
            htmlFor="interestRate"
            className="block text-sm font-medium text-gray-700"
          >
            Interest Rate (%)
          </label>
          <input
            type="number"
            id="interestRate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            step="0.1"
            min="0"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-3 h-12 font-semibold rounded-lg shadow-md transition duration-200 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Saving will update the rate for all new loans and recalculate payments
        for all existing active loans.
      </p>
    </div>
  );
};

export default SettingsPanel;