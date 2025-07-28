import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, Activity, Award } from 'lucide-react';

const AdminDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('week');
  const [graphFilter, setGraphFilter] = useState('daily');
  const [statsData, setStatsData] = useState({
    newStudents: 0,
    newEnrollments: 0,
    activeStudents: 0,
    completionRate: 0
  });
  const [graphData, setGraphData] = useState({
    studentsData: [],
    enrollmentsData: [],
    activeData: [],
    completionData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stats data
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/stats?period=${timeFilter}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStatsData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch graph data
  const fetchGraphData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/graph-stats?period=${graphFilter}`);
      if (!response.ok) throw new Error('Failed to fetch graph data');
      const data = await response.json();
      setGraphData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeFilter]);

  useEffect(() => {
    fetchGraphData();
  }, [graphFilter]);

  useEffect(() => {
    fetchStats();
    fetchGraphData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, suffix = '' }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? '...' : `${value}${suffix}`}
          </p>
        </div>
        <Icon className="h-8 w-8" style={{ color }} />
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading dashboard: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Analytics</h1>
        <div className="flex space-x-4">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="day">This Day</option>
            <option value="week">This Week(Last Monday to Today)</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="New Students"
          value={statsData.newStudents}
          icon={Users}
          color="#3B82F6"
        />
        <StatCard
          title="New Enrollments"
          value={statsData.newEnrollments}
          icon={BookOpen}
          color="#10B981"
        />
        <StatCard
          title="Active Students"
          value={statsData.activeStudents}
          icon={Activity}
          color="#F59E0B"
        />
        <StatCard
          title="Completion Rate"
          value={statsData.completionRate}
          icon={Award}
          color="#EF4444"
          suffix="%"
        />
      </div>

      {/* Graph Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Analytics Trends</h2>
          <select
            value={graphFilter}
            onChange={(e) => setGraphFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="daily">Daily (Last 30 days)</option>
            <option value="monthly">Monthly (Last 12 months)</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Bar Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* New Students Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">New Students</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graphData.studentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* New Enrollments Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">New Enrollments</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graphData.enrollmentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Active Students Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Active Students</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graphData.activeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Completion Rate Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Completion Rate</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graphData.completionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rate" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;