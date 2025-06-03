import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const ChequePayments = () => {
  const [chequePayments, setChequePayments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchChequePayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/incomes/?payment_mode=cheque');
      let filtered = response.data.filter(income => income.payment_mode === 'cheque');

      if (filterStatus) {
        filtered = filtered.filter(
          (income) => income.cheque && income.cheque.status === filterStatus
        );
      }

      setChequePayments(filtered);
    } catch (error) {
      console.error('Error fetching cheque payments:', error);
    }
    setLoading(false);
  };

  const updateChequeStatus = async (chequeId, newStatus) => {
    try {
      await axios.patch(`/cheques/${chequeId}/`, { status: newStatus });
      fetchChequePayments(); // Refresh after update
    } catch (error) {
      console.error('Error updating cheque status:', error);
    }
  };

  useEffect(() => {
    fetchChequePayments();
  }, [filterStatus]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Cheque Payments</h2>

      <div className="mb-4">
        <label className="mr-2">Filter by Status:</label>
        <select
          className="border p-1"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="cleared">Cleared</option>
          <option value="bounced">Bounced</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Billing Number</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Shop</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">Cheque Number</th>
              <th className="border px-2 py-1">Bank</th>
              <th className="border px-2 py-1">Cheque Date</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {chequePayments.map((income) => (
              <tr key={income.id}>
                <td className="border px-2 py-1">{income.billing_number}</td>
                <td className="border px-2 py-1">{income.date}</td>
                <td className="border px-2 py-1">{income.medical_shop?.name}</td>
                <td className="border px-2 py-1">₹{income.amount}</td>
                <td className="border px-2 py-1">{income.cheque?.cheque_number}</td>
                <td className="border px-2 py-1">{income.cheque?.bank_name}</td>
                <td className="border px-2 py-1">{income.cheque?.cheque_date}</td>
                <td className="border px-2 py-1 capitalize">{income.cheque?.status}</td>
                <td className="border px-2 py-1">
                  <select
                    value={income.cheque?.status}
                    onChange={(e) =>
                      updateChequeStatus(income.cheque.id, e.target.value)
                    }
                    className="border px-1 py-0.5 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="cleared">Cleared</option>
                    <option value="bounced">Bounced</option>
                  </select>
                </td>
              </tr>
            ))}
            {chequePayments.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-2 text-gray-500">
                  No cheque payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ChequePayments;
