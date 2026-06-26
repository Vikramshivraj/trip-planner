import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGlobeAsia } from "react-icons/fa";
import API from "../api/api";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleRegister = async () => {

    try {

      const res = await API.post(
        "/auth/register",
        formData
      );

      alert(res.data.message);

      navigate("/");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-purple-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

        <div className="flex justify-center mb-6">
          <div className="bg-purple-600 p-4 rounded-2xl">
            <FaGlobeAsia className="text-white text-3xl" />
          </div>
        </div>

        <h1 className="text-white text-4xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-zinc-400 text-center mb-8">
          Start managing your travel journey 🌍
        </p>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Name"
          className="w-full p-4 rounded-xl bg-zinc-900/80 border border-zinc-700 text-white outline-none mb-4 focus:border-purple-500 transition-all"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Email"
          className="w-full p-4 rounded-xl bg-zinc-900/80 border border-zinc-700 text-white outline-none mb-4 focus:border-purple-500 transition-all"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter Password"
          className="w-full p-4 rounded-xl bg-zinc-900/80 border border-zinc-700 text-white outline-none mb-6 focus:border-purple-500 transition-all"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.02] transition-all text-white p-4 rounded-xl font-semibold shadow-lg"
        >
          Register
        </button>

        <p className="text-zinc-400 text-center mt-6">
          Already have an account?

          <Link
            to="/"
            className="text-purple-400 ml-1 hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>

  );

};

export default Register;