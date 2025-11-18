import React, { useState, useEffect } from 'react';
import { getLoanStats } from '../api/loanApi';

// Helper to format currency
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0.00';
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// A reusable card component
const KpiCard = ({ title, value, subtext, color = 'gray' }) => {
  // Define color themes
  const themes = {
    gray: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      sub: 'text-gray-600',
      value: 'text-gray-900',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      sub: 'text-blue-600',
      value: 'text-blue-900',
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      sub: 'text-green-600',
      value: 'text-green-900',
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      sub: 'text-red-600',
      value: 'text-red-900',
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      sub: 'text-yellow-600',
      value: 'text-yellow-900',
    },
  };
  
  const theme = themes[color] || themes.gray;

  return (
    // Apply the theme's background color
    <div className={`${theme.bg} p-6 rounded-lg shadow`}>
      {/* Apply the theme's text color */}
      <div className={`text-sm font-medium ${theme.text}`}>{title}</div>
      {/* Apply the theme's main value color */}
      <div className={`text-3xl font-bold ${theme.value} mt-1`}>{value}</div>
      {/* Apply the theme's subtext color */}
      {subtext && <div className={`text-sm ${theme.sub} mt-2`}>{subtext}</div>}
    </div>
  );
};

const KpiDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await getLoanStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Failed to load statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []); 

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-500">
        Loading statistics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600" role="alert">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null; 
  }

  // --- Process the data from the API ---
  const approved = stats.approved || { count: 0, totalAmount: 0 };
  const rejected = stats.rejected || { count: 0, totalAmount: 0 };
  const pending = stats.pending || { count: 0, totalAmount: 0 };

  const totalApplications = approved.count + rejected.count + pending.count;
  const totalDecided = approved.count + rejected.count;
  
  const approvalRate = totalDecided > 0 
    ? ((approved.count / totalDecided) * 100).toFixed(1) + '%' 
    : 'N/A';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <KpiCard 
        title="Total Applications" 
        value={totalApplications}
        subtext={`${pending.count} pending review`} 
        color="blue" 
      />
      <KpiCard 
        title="Approval Rate" 
        value={approvalRate}
        subtext={`${totalDecided} decisions made`} 
        color="yellow" 
      />
      <KpiCard 
        title="Total Value Approved" 
        value={formatCurrency(approved.totalAmount)}
        subtext={`${approved.count} loans`} 
        color="green" 
      />
      <KpiCard 
        title="Total Value Rejected" 
        value={formatCurrency(rejected.totalAmount)}
        subtext={`${rejected.count} loans`} 
        color="red" 
      />
      <KpiCard 
        title="Total Value Pending" 
        value={formatCurrency(pending.totalAmount)}
        subtext={`${pending.count} loans`}
        color="gray" 
      />
      <KpiCard 
        title="Avg. Approved Loan" 
        value={approved.count > 0 ? formatCurrency(approved.totalAmount / approved.count) : '$0.00'}
        subtext="Average value"
        color="green" 
      />
    </div>

  );
};

export default KpiDashboard;