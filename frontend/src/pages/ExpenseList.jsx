import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    category: '',
  });

  const fetchExpenses = async () => {
    const query = new URLSearchParams(filters).toString();
    const res = await axios.get(`expenses/?${query}`);
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchExpenses();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Expense Records</h2>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" onSubmit={handleSubmit}>
        <input type="date" name="start_date" onChange={handleChange} className="border p-2 rounded" />
        <input type="date" name="end_date" onChange={handleChange} className="border p-2 rounded" />
        <select name="category" onChange={handleChange} className="border p-2 rounded">
          <option value="">All Categories</option>
          <option value="salary">Staff Salary</option>
          <option value="rent">Rent</option>
          <option value="petrol">Petrol</option>
          <option value="utility">Utility Bills</option>
          <option value="supplies">Office Supplies</option>
          <option value="maintenance">Maintenance</option>
          <option value="other">Other</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Filter</button>
      </form>

      <table className="min-w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Description</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td className="p-2 border">{exp.date}</td>
              <td className="p-2 border">{exp.category}</td>
              <td className="p-2 border">₹{exp.amount}</td>
              <td className="p-2 border">{exp.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-4 mb-4">
        <a
          href={`http://127.0.0.1:8000/api/expenses/export/excel/?${new URLSearchParams(filters).toString()}`}
          className="bg-green-600 text-white px-4 py-2 rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          Export Expenses to Excel
        </a>
        <a
          href={`http://127.0.0.1:8000/api/expenses/export/pdf/?${new URLSearchParams(filters).toString()}`}
          className="bg-red-600 text-white px-4 py-2 rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          Export Expenses to PDF
        </a>
      </div>
    </div>
  );
};

export default ExpenseList;
