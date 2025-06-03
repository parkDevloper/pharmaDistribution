import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from '../api/axios';

const Income = () => {
  const { register, handleSubmit, watch, reset, setValue } = useForm();
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShop, setSelectedShop] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingShops, setLoadingShops] = useState(false);
  const [addingShop, setAddingShop] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const paymentMode = watch('payment_mode');

  // Fetch matching shops as user types
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setShops([]);
      return;
    }

    const fetchShops = async () => {
      setLoadingShops(true);
      try {
        const res = await axios.get(medicalshops/search/?q=${searchTerm});
        setShops(res.data);
      } catch (err) {
        console.error('Failed to search shops', err);
      } finally {
        setLoadingShops(false);
      }
    };

    fetchShops();
  }, [searchTerm]);

  // When selectedShop changes, update form value
  useEffect(() => {
    if (selectedShop) {
      setValue('medical_shop', selectedShop.id);
      setSearchTerm(selectedShop.name);
    } else {
      setValue('medical_shop', '');
    }
  }, [selectedShop, setValue]);

  const onSubmit = async (data) => {
    if (!selectedShop) {
      alert('Please select or add a medical shop.');
      return;
    }

    setSubmitting(true);

    try {
      let chequeId = null;

      if (data.payment_mode === 'cheque') {
        const chequePayload = {
          cheque_number: data.cheque_number,
          bank_name: data.bank_name,
          cheque_date: data.cheque_date,
          status: data.cheque_status,
        };
        const chequeRes = await axios.post('cheques/', chequePayload);
        chequeId = chequeRes.data.id;
      }

      const incomePayload = {
        billing_number: data.billing_number,
        medical_shop_id: selectedShop.id,
        payment_mode: data.payment_mode,
        amount: data.amount,
        date: data.date,
        cheque_id: chequeId,
      };

      await axios.post('incomes/', incomePayload);
      alert('Income entry saved!');
      reset();
      setSelectedShop(null);
      setSearchTerm('');
    } catch (err) {
      console.error('Failed to submit income', err);
      alert('Failed to save. Check console for errors.');
    } finally {
      setSubmitting(false);
    }
  };

  // Add new shop function
  const addNewShop = async () => {
    if (searchTerm.trim() === '') return;
    setAddingShop(true);
    try {
      const res = await axios.post('medicalshops/', { name: searchTerm.trim() });
      setSelectedShop(res.data);
      setShops([]);
      alert(Added new shop: ${res.data.name});
    } catch (err) {
      console.error('Failed to add new shop', err);
      alert('Failed to add new shop.');
    } finally {
      setAddingShop(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Income Entry</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">

        <div>
          <label className="block font-medium">Billing Number</label>
          <input {...register('billing_number')} className="input" required />
        </div>

        <div style={{ position: 'relative' }}>
          <label className="block font-medium">Medical Shop</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedShop(null);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // Delay to allow click on suggestion
            placeholder="Type to search or add..."
            className="input"
            required
            autoComplete="off"
          />
          {showSuggestions && (
            <div className="absolute bg-white border border-gray-300 w-full max-h-60 overflow-auto z-10">
              {loadingShops ? (
                <div className="p-2 text-gray-500">Loading...</div>
              ) : shops.length > 0 ? (
                shops.map(shop => (
                  <div
                    key={shop.id}
                    onClick={() => {
                      setSelectedShop(shop);
                      setShowSuggestions(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {shop.name}
                  </div>
                ))
              ) : (
                <div className="p-2">
                  No matches.
                  <button
                    type="button"
                    onClick={addNewShop}
                    disabled={addingShop}
                    className="ml-2 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {addingShop ? 'Adding...' : Add "${searchTerm}"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block font-medium">Date</label>
          <input type="date" {...register('date')} className="input" required />
        </div>

        <div>
          <label className="block font-medium">Payment Mode</label>
          <select {...register('payment_mode')} className="input" required>
            <option value="">Select</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>

        {paymentMode === 'cheque' && (
          <>
            <div>
              <label className="block font-medium">Cheque Number</label>
              <input {...register('cheque_number')} className="input" required />
            </div>

            <div>
              <label className="block font-medium">Bank Name</label>
              <input {...register('bank_name')} className="input" required />
            </div>

            <div>
              <label className="block font-medium">Cheque Date</label>
              <input type="date" {...register('cheque_date')} className="input" required />
            </div>

            <div>
              <label className="block font-medium">Cheque Status</label>
              <select {...register('cheque_status')} className="input" required>
                <option value="pending">Pending</option>
                <option value="cleared">Cleared</option>
                <option value="bounced">Bounced</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block font-medium">Total Amount</label>
          <input type="number" step="0.01" {...register('amount')} className="input" required />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {submitting ? 'Saving...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default Income;