import { useEffect, useState } from "react";

import {
  FaWallet,
  FaMapMarkedAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

import API from "../api/api";

const Dashboard = () => {

  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);

  const [darkMode, setDarkMode] = useState(true);

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
   
const handleDelete = async (id) => {

  try {

    const token = localStorage.getItem("token");

    const res = await API.delete(
      `/trips/${id}`,
      {
        headers: {
          authorization: token,
        },
      }
    );

    alert(res.data.message);

    fetchTrips();

  } catch (error) {

    console.log(error);

    alert("Delete Failed");

  }
};
const handleUpdate = async (trip) => {

  const newName = prompt(
    "Enter New Trip Name",
    trip.trip_name
  );

  if (!newName) return;

  try {

    const token = localStorage.getItem("token");

    const updatedTrip = {

      trip_name: newName,
      destination: trip.destination,
      budget: trip.budget,

    };

    const res = await API.put(
      `/trips/${trip.id}`,
      updatedTrip,
      {
        headers: {
          authorization: token,
        },
      }
    );

    alert(res.data.message);

    fetchTrips();

  } catch (error) {

    console.log(error);

    alert("Update Failed");

  }
};
  // logout
  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/");

  };

  // total budget
  const totalBudget = trips.reduce(
    (acc, trip) =>
      acc + Number(trip.budget),
    0
  );

  // demo expense
  const totalExpenses = 32000;

  return (
    <div
  className={
    darkMode
      ? "min-h-screen bg-black text-white flex"
      : "min-h-screen bg-gray-100 text-black flex"
  }
>

      {/* Sidebar */}
    <div
  className={
    darkMode
      ? "w-[250px] bg-zinc-950 border-r border-zinc-800 p-6"
      : "w-[250px] bg-white border-r border-gray-300 p-6"
  }
>
        <h1 className="text-3xl font-bold mb-10 text-blue-500">
          TripPlanner
        </h1>

        <div className="flex flex-col gap-4">

          {/* Dashboard */}
          <button className="bg-blue-600 p-4 rounded-xl text-left hover:bg-blue-700 transition-all">
            Dashboard
          </button>

          {/* Create Trip */}
          <Link
            to="/create-trip"
            className={
  darkMode
    ? "bg-zinc-900 p-4 rounded-xl hover:bg-zinc-800 transition-all"
    : "bg-gray-200 p-4 rounded-xl hover:bg-gray-300 transition-all"
}
          >
            Create Trip
          </Link>

          {/* Add Expense */}
          <Link
            to="/add-expense"
            className={
  darkMode
    ? "bg-zinc-900 p-4 rounded-xl hover:bg-zinc-800 transition-all"
    : "bg-gray-200 p-4 rounded-xl hover:bg-gray-300 transition-all"
}
          >
            Add Expense
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 transition-all p-4 rounded-xl text-left"
          >
            Logout
          </button>

          <button
  onClick={() => setDarkMode(!darkMode)}
  className="bg-yellow-500 hover:bg-yellow-600 transition-all p-4 rounded-xl text-left"
>
  {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
</button>

        </div>

      </div>

      {/* Main */}
        <div
  className={
    darkMode
      ? "flex-1 p-8 bg-gradient-to-br from-black via-zinc-950 to-zinc-900 overflow-auto"
      : "flex-1 p-8 bg-gradient-to-br from-gray-100 via-white to-gray-200 overflow-auto"
  }
>
        <h1 className="text-5xl font-bold mb-2">
          Travel Dashboard ✈️
        </h1>

        <p className="text-zinc-400 mb-10">
          Track budgets and organize adventures smarter.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          {/* Trips */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-6 rounded-3xl shadow-xl">

            <FaMapMarkedAlt className="text-4xl mb-4" />

            <h2 className="text-xl font-semibold">
              Total Trips
            </h2>

            <p className="text-4xl font-bold mt-4">
              {trips.length}
            </p>

          </div>

          {/* Budget */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-500 p-6 rounded-3xl shadow-xl">

            <FaWallet className="text-4xl mb-4" />

            <h2 className="text-xl font-semibold">
              Total Budget
            </h2>

            <p className="text-4xl font-bold mt-4">
              ₹{totalBudget}
            </p>

          </div>

          {/* Expenses */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-6 rounded-3xl shadow-xl">

            <FaMoneyBillWave className="text-4xl mb-4" />

            <h2 className="text-xl font-semibold">
              Expenses
            </h2>

            <p className="text-4xl font-bold mt-4">
              ₹{totalExpenses}
            </p>

          </div>

        </div>

        {/* Trips */}
        <div
  className={
    darkMode
      ? "bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6"
      : "bg-white border border-gray-300 rounded-3xl p-6 shadow-lg"
  }
>
          <h2
  className={
    darkMode
      ? "text-2xl font-bold mb-6"
      : "text-2xl font-bold mb-6 text-black"
  }
>
            Your Trips
          </h2>

          <div className="space-y-4">

            {
              trips.map((trip) => (

                <div
                  key={trip.id}
                  className={
  darkMode
    ? "bg-zinc-800 p-5 rounded-2xl flex justify-between items-center"
    : "bg-gray-100 p-5 rounded-2xl flex justify-between items-center border border-gray-300"
}                >

                  <div>

                    <h3 className="font-semibold text-xl">
                      {trip.trip_name}
                    </h3>

                    <p className={darkMode ? "text-zinc-400" : "text-gray-600"}>
                      {trip.destination}
                    </p>

                    <p className="text-zinc-500 mt-1">
                      Budget: ₹{trip.budget}
                    </p>

                  </div>

                 <div className="flex gap-3">

  {/* View */}
 <button
  onClick={() => navigate(`/trip/${trip.id}`)}
  className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
>
  View
</button>

  {/* Edit */}
  <button
    onClick={() => handleUpdate(trip)}
    className="bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-600"
  >
    Edit
  </button>

  {/* Delete */}
  <button
    onClick={() => handleDelete(trip.id)}
    className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
  >
    Delete
  </button>

</div>


</div>


              ))
            }

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;