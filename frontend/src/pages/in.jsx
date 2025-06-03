import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import AddPartialPaymentForm from '../components/AddPartialPaymentForm';

const IncomeList = () => {
  const [incomes, setIncomes] = useState([]);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    payment_mode: '',
    medical_shop: '',
  });

  const [shops, setShops] = useState([]);
  const [activeIncomeId, setActiveIncomeId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchIncomes = async () => {
    setLoading(true);
    const query = new URLSearchParams(filters).toString();
    const res = await axios.get(`incomes/?${query}`);
    setIncomes(res.data);
    setLoading(false);
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

      {loading ? (
        <p className="text-center text-gray-600">Loading incomes...</p>
      ) : (
        <table className="min-w-full table-auto border mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Billing #</th>
              <th className="p-2 border">Medical Shop</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Payment Mode</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((inc) => (
              <React.Fragment key={inc.id}>
                <tr>
                  <td className="p-2 border">{inc.date}</td>
                  <td className="p-2 border">{inc.billing_number}</td>
                  <td className="p-2 border">{inc.medical_shop.name}</td>
                  <td className="p-2 border">₹{inc.amount}</td>
                  <td className="p-2 border">{inc.payment_mode}</td>
                </tr>
                <tr>
                  <td colSpan={5} className="p-2 border bg-gray-50">
                    {/* Show only if payment is cheque */}
                    {inc.payment_mode === 'cheque' && (
                      <button
                        className="bg-indigo-600 text-white px-3 py-1 rounded mb-2"
                        onClick={() =>
                          setActiveIncomeId((prev) => (prev === inc.id ? null : inc.id))
                        }
                      >
                        {activeIncomeId === inc.id ? 'Close Payment Form' : 'Add Payment'}
                      </button>
                    )}

                    {/* Show partial payments */}
                    {inc.partial_payments && inc.partial_payments.length > 0 && (
                      <div className="mb-2">
                        <h4 className="text-sm font-semibold mb-1">Previous Payments:</h4>
                        <ul className="text-sm text-gray-700 list-disc list-inside">
                          {inc.partial_payments.map((pmt) => (
                            <li key={pmt.id}>
                              ₹{pmt.amount} on {pmt.date}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Form */}
                    {activeIncomeId === inc.id && (
                      <AddPartialPaymentForm
                        incomeId={inc.id}
                        onSuccess={() => {
                          fetchIncomes();
                          setActiveIncomeId(null);
                        }}
                      />
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex gap-4 mb-4">
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
