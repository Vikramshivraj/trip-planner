import { useState } from "react";
import API from "../api/api";

const CreateTrip = () => {

  const [darkMode, setDarkMode] = useState(true);

  const [formData, setFormData] = useState({
    trip_name: "",
    destination: "",
    start_date: "",
    end_date: "",
    budget: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleCreateTrip = async () => {

    try {

      // validation
      const today = new Date();

      const start = new Date(formData.start_date);

      const end = new Date(formData.end_date);

      // past date check
      if (start < today.setHours(0,0,0,0)) {

        alert("Start date cannot be in the past");

        return;
      }

      // end date check
      if (end < start) {

        alert("End date cannot be before start date");

        return;
      }

      const token = localStorage.getItem("token");

      const res = await API.post(
        "/trips/create",
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

      alert("Trip Creation Failed");

    }
  };

  return (

    <div
      className={
        darkMode
          ? "min-h-screen bg-gradient-to-br from-black via-zinc-950 to-purple-950 flex items-center justify-center p-6"
          : "min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-6"
      }
    >

      <div
        className={
          darkMode
            ? "w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
            : "w-full max-w-2xl bg-white border border-gray-300 rounded-3xl p-8 shadow-2xl"
        }
      >

        {/* Toggle */}
        <div className="flex justify-end mb-4">

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-yellow-500 hover:bg-yellow-600 transition-all px-4 py-2 rounded-xl text-black font-semibold"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

        </div>

        <h1
          className={
            darkMode
              ? "text-white text-4xl font-bold mb-2"
              : "text-black text-4xl font-bold mb-2"
          }
        >
          Create New Trip ✈️
        </h1>

        <p className="text-zinc-400 mb-8">
          Organize your next adventure smarter.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Trip Name */}
          <input
            type="text"
            name="trip_name"
            placeholder="Trip Name"
            onChange={handleChange}
            className={
              darkMode
                ? "p-4 rounded-xl bg-zinc-900/80 border border-zinc-700 text-white outline-none"
                : "p-4 rounded-xl bg-gray-100 border border-gray-300 text-black outline-none"
            }
          />

          {/* Destination */}
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            onChange={handleChange}
            className={
              darkMode
                ? "p-4 rounded-xl bg-zinc-900/80 border border-zinc-700 text-white outline-none"
                : "p-4 rounded-xl bg-gray-100 border border-gray-300 text-black outline-none"
            }
          />

          {/* Start Date */}
          <input
            type="date"
            name="start_date"
            min={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            className={
              darkMode
                ? "p-4 rounded-xl bg-zinc-900/80 border border-zinc-700 text-white outline-none"
                : "p-4 rounded-xl bg-gray-100 border border-gray-300 text-black outline-none"
            }
          />

          {/* End Date */}
          <input
            type="date"
            name="end_date"
            onChange={handleChange}
            className={
              darkMode
                ? "p-4 rounded-xl bg-zinc-900/80 border border-zinc-700 text-white outline-none"
                : "p-4 rounded-xl bg-gray-100 border border-gray-300 text-black outline-none"
            }
          />

          {/* Budget */}
          <input
            type="number"
            name="budget"
            placeholder="Budget"
            onChange={handleChange}
            className={
              darkMode
                ? "md:col-span-2 p-4 rounded-xl bg-zinc-900/80 border border-zinc-700 text-white outline-none"
                : "md:col-span-2 p-4 rounded-xl bg-gray-100 border border-gray-300 text-black outline-none"
            }
          />

        </div>

        {/* Button */}
        <button
          onClick={handleCreateTrip}
          className="w-full mt-8 bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.02] transition-all text-white p-4 rounded-xl font-semibold shadow-lg"
        >
          Create Trip
        </button>

      </div>

    </div>
  );
};

export default CreateTrip;