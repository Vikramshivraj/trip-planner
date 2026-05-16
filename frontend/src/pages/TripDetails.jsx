import { useEffect, useState } from "react";

import {
  useParams,
} from "react-router-dom";

import API from "../api/api";

const TripDetails = () => {

  const { id } = useParams();

  const [expenses, setExpenses] = useState([]);

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {

    fetchExpenses();

    fetchAnalytics();

  }, []);

  const fetchExpenses = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.get(
        `/trips/expenses/${id}`,
        {
          headers: {
            authorization: token,
          },
        }
      );

      setExpenses(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  const fetchAnalytics = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.get(
        `/trips/analytics/${id}`,
        {
          headers: {
            authorization: token,
          },
        }
      );

      setAnalytics(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  if (!analytics) {
    return (
      <div className="text-white p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-5xl font-bold mb-3">
        {analytics.trip_name} ✈️
      </h1>

      <p className="text-zinc-400 mb-10">
        Complete trip analytics & expenses
      </p>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-blue-600 p-6 rounded-3xl">

          <h2 className="text-xl mb-3">
            Budget
          </h2>

          <p className="text-4xl font-bold">
            ₹{analytics.budget}
          </p>

        </div>

        <div className="bg-pink-600 p-6 rounded-3xl">

          <h2 className="text-xl mb-3">
            Total Spent
          </h2>

          <p className="text-4xl font-bold">
            ₹{analytics.total_spent}
          </p>

        </div>

        <div className="bg-green-600 p-6 rounded-3xl">

          <h2 className="text-xl mb-3">
            Remaining
          </h2>

          <p className="text-4xl font-bold">
            ₹{analytics.remaining_budget}
          </p>

        </div>

      </div>

      {/* Expenses */}
      <div className="bg-zinc-900 p-6 rounded-3xl">

        <h2 className="text-3xl font-bold mb-6">
          Expenses 💸
        </h2>

        <div className="space-y-4">

          {
            expenses.map((expense) => (

              <div
                key={expense.id}
                className="bg-zinc-800 p-5 rounded-2xl flex justify-between"
              >

                <div>

                  <h3 className="text-xl font-semibold">
                    {expense.category}
                  </h3>

                  <p className="text-zinc-400">
                    {expense.expense_date}
                  </p>

                </div>

                <h2 className="text-2xl font-bold text-green-400">
                  ₹{expense.amount}
                </h2>

              </div>

            ))
          }

        </div>

      </div>

    </div>
  );
};

export default TripDetails;