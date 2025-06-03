import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import axios from '../api/axios';

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('dashboard-summary/')
      .then(res => setData(res.data));
  }, []);

  if (!data) return <div className="p-4">Loading dashboard...</div>;

  const barData = [
    {
      name: 'Summary',
      Income: data.total_income,
      Expense: data.total_expense,
      Profit: data.net_profit,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Income vs Expense</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Income" fill="#00C49F" />
            <Bar dataKey="Expense" fill="#FF8042" />
            <Bar dataKey="Profit" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
