import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const ExpenseForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false); // success state

  const onSubmit = async (data) => {
    try {
      await axios.post('expenses/', data);
      setSuccess(true);      // Show success message
      reset();               // Reset form

      setTimeout(() => {
        setSuccess(false);   // Optional: hide message after redirect
        navigate('/expenses');
      }, 2000);              // Wait 2 seconds before redirect
    } catch (error) {
      console.error("Expense save error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-4">
      <h2 className="text-2xl font-bold mb-4">Add Expense</h2>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          Expense saved successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <select {...register("category")} className="w-full p-2 border rounded" required>
          <option value="">Select Category</option>
          <option value="salary">Staff Salary</option>
          <option value="rent">Rent</option>
          <option value="petrol">Petrol</option>
          <option value="utility">Utility Bills</option>
          <option value="supplies">Office Supplies</option>
          <option value="maintenance">Maintenance</option>
          <option value="other">Other</option>
        </select>

        <textarea
          {...register("description")}
          placeholder="Description"
          className="w-full p-2 border rounded"
        ></textarea>

        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          {...register("amount")}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="date"
          {...register("date")}
          className="w-full p-2 border rounded"
          required
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
