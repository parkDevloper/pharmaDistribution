import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const IncomeList = () => {
  const [incomes, setIncomes] = useState([]);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    payment_mode: '',
    medical_shop: '',
  });

  const [shops, setShops] = useState([]);

  const fetchIncomes = async () => {
    const query = new URLSearchParams(filters).toString();
    const res = await axios.get(`incomes/?${query}`);
    setIncomes(res.data);
  };

  const fetchShops = async () => {
    const res = await axios.get(`medicalshops/`);
    setShops(res.data);
  };

  useEffect(() => {
    fetchIncomes();
    fetchShops();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchIncomes();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Income Records</h2>

      {/* Filter Form */}
      <form className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" onSubmit={handleSubmit}>
        <input type="date" name="start_date" onChange={handleChange} className="border p-2 rounded" />
        <input type="date" name="end_date" onChange={handleChange} className="border p-2 rounded" />

        <select name="payment_mode" onChange={handleChange} className="border p-2 rounded">
          <option value="">All Payment Modes</option>
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="cheque">Cheque</option>
        </select>

        <select name="medical_shop" onChange={handleChange} className="border p-2 rounded">
          <option value="">All Shops</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded col-span-1 md:col-span-4">
          Filter
        </button>
      </form>

      {/* Table */}
      <table className="min-w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Billing #</th>
            <th className="p-2 border">Medical Shop</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Payment Mode</th>
            <th className="p-2 border">Cheque Status</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((inc) => {
            const chequeStatus = 
              inc.payment_mode === 'cheque' && inc.cheque
                ? inc.cheque.status
                : '-';

            return (
              <tr key={inc.id}>
                <td className="p-2 border">{inc.date}</td>
                <td className="p-2 border">{inc.billing_number}</td>
                <td className="p-2 border">{inc.medical_shop?.name || '-'}</td>
                <td className="p-2 border">₹{inc.amount}</td>
                <td className="p-2 border">{inc.payment_mode}</td>
                <td className="p-2 border">{chequeStatus}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Export Links */}
      <div className="flex gap-4 mb-4 mt-4">
        <a
          href={`http://127.0.0.1:8000/api/incomes/export/excel/?${new URLSearchParams(filters).toString()}`}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          Export to Excel
        </a>
        <a
          href={`http://127.0.0.1:8000/api/incomes/export/pdf/?${new URLSearchParams(filters).toString()}`}
          className="bg-red-600 text-white px-4 py-2 rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          Export to PDF
        </a>
      </div>
    </div>
  );
};

export default IncomeList;
