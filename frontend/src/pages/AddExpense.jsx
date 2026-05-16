import { useEffect, useState } from "react";
import API from "../api/api";

const AddExpense = () => {

  const [trips, setTrips] = useState([]);

  const [formData, setFormData] = useState({
    trip_id: "",
    category: "",
    amount: "",
    expense_date: "",
  });

  useEffect(() => {

    fetchTrips();

  }, []);

  const fetchTrips = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.get(
        "/trips",
        {
          headers: {
            authorization: token,
          },
        }
      );

      setTrips(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleAddExpense = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.post(
        "/trips/expense",
        formData,
        {
          headers: {
            authorization: token,
          },
        }
      );

      alert(res.data.message);

    } catch (error) {

      console.log(error);

      alert("Failed To Add Expense");

    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 flex items-center justify-center p-6">

      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

        <h1 className="text-white text-4xl font-bold mb-2">
          Add Expense 💸
        </h1>

        <p className="text-zinc-400 mb-8">
          Track your travel spending smarter.
        </p>

        <div className="space-y-4">

          {/* Trip Dropdown */}
          <select
            name="trip_id"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white outline-none"
          >

            <option value="">
              Select Trip
            </option>

            {
              trips.map((trip) => (

                <option
                  key={trip.id}
                  value={trip.id}
                >
                  {trip.trip_name}
                </option>

              ))
            }

          </select>

          {/* Category */}
          <select
            name="category"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white outline-none"
          >

            <option value="">
              Select Category
            </option>

            <option value="Hotel">
              Hotel
            </option>

            <option value="Food">
              Food
            </option>

            <option value="Transport">
              Transport
            </option>

            <option value="Shopping">
              Shopping
            </option>

          </select>

          {/* Amount */}
          <input
            type="number"
            name="amount"
            placeholder="Enter Amount"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white outline-none"
          />

          {/* Date */}
          <input
            type="date"
            name="expense_date"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white outline-none"
          />

          <button
            onClick={handleAddExpense}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-[1.02] transition-all text-white p-4 rounded-xl font-semibold shadow-lg"
          >
            Add Expense
          </button>

        </div>

      </div>

    </div>
  );
};

export default AddExpense;