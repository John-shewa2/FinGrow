import React from 'react';
import SettingsPanel from '../components/SettingsPanel'; 

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Global Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage the application's global interest rate.
          </p>
        </div>

        {/* Content Area */}
        <SettingsPanel />
      </div>
    </div>
  );
};

export default SettingsPage;