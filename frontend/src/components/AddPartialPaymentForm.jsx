import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";

const AddPartialPaymentForm = ({ incomeId, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/partial-payments/", {
        income: incomeId,
        amount_paid: data.amount_paid,
        date_paid: data.date_paid,
      });

      reset();
      if (onSuccess) onSuccess(); // Refresh parent list
      alert("Partial Payment Added!");
    } catch (error) {
      console.error("Error adding payment:", error);
      alert("Error adding payment");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded bg-gray-50 mb-4">
      <h3 className="text-lg font-semibold mb-2">Add Partial Payment</h3>
      <div className="mb-2">
        <label className="block mb-1">Amount Paid</label>
        <input
          type="number"
          step="0.01"
          {...register("amount_paid", { required: true })}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Date Paid</label>
        <input
          type="date"
          {...register("date_paid", { required: true })}
          className="w-full border p-2 rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Payment
      </button>
    </form>
  );
};

export default AddPartialPaymentForm;
