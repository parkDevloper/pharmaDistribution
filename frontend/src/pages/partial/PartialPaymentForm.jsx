import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const PartialPaymentForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const [incomes, setIncomes] = useState([]);
  const [selectedIncomeId, setSelectedIncomeId] = useState('');
  const [billingSummary, setBillingSummary] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch incomes on mount
  useEffect(() => {
    axios.get('incomes/').then(res => setIncomes(res.data));
  }, []);

  // Fetch billing summary when a bill is selected
  const handleIncomeChange = async (e) => {
    const incomeId = e.target.value;
    setSelectedIncomeId(incomeId);
    setBillingSummary(null);

    const selectedIncome = incomes.find(i => i.id.toString() === incomeId);
    if (!selectedIncome) return;

    try {
      const res = await axios.get(`/income-partial-summary/?billing_number=${selectedIncome.billing_number}`);
      setBillingSummary(res.data);
    } catch (err) {
      console.error('Error fetching billing summary:', err);
    }
  };

  // Form submission handler with validation
  const onSubmit = async (data) => {
    const amountToPay = parseFloat(data.amount_paid);
    const remaining = billingSummary?.amount_due;

    if (amountToPay > remaining) {
      alert(`You can only pay up to ₹${remaining}. Please reduce the amount.`);
      return;
    }

    try {
      await axios.post('partial-payments/', data);
      setSuccess(true);
      reset();
      setBillingSummary(null);
      setTimeout(() => {
        setSuccess(false);
        navigate('/incomes');
      }, 2000);
    } catch (err) {
      console.error('Error saving partial payment:', err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-4">Add Partial Payment</h2>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          Payment saved successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Bill selector */}
        <select
          {...register("income")}
          className="w-full border p-2 rounded"
          required
          onChange={handleIncomeChange}
        >
          <option value="">Select Income Bill</option>
          {incomes.map(income => (
            <option key={income.id} value={income.id}>
              {income.billing_number} - {income.medical_shop.name}
            </option>
          ))}
        </select>

        {/* Remaining balance display */}
        {billingSummary && (
          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded">
            ₹{billingSummary.amount_paid} paid so far. ₹{billingSummary.amount_due} remaining.
          </div>
        )}

        {/* Amount input */}
        <input
          type="number"
          step="0.01"
          placeholder="Amount Paid"
          {...register("amount_paid")}
          className="w-full border p-2 rounded"
          required
          max={billingSummary?.amount_due || ''}
        />

        {/* Date input */}
        <input
          type="date"
          {...register("date_paid")}
          className="w-full border p-2 rounded"
          required
        />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Save Payment
        </button>
      </form>
    </div>
  );
};

export default PartialPaymentForm;
