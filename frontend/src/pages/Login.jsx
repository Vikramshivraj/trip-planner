import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlaneDeparture } from "react-icons/fa";
import API from "../api/api";

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {

      const res = await API.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      alert(res.data.message);

      navigate("/dashboard");

    } catch (error) {
      console.log(error);

      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-blue-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-2xl">
            <FaPlaneDeparture className="text-white text-3xl" />
          </div>
        </div>

        <h1 className="text-white text-4xl font-bold text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-zinc-400 text-center mb-8">
          Plan your next journey smarter ✈️
        </p>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-zinc-900/80 border border-zinc-700 text-white outline-none mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-zinc-900/80 border border-zinc-700 text-white outline-none mb-6"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.02] transition-all text-white p-4 rounded-xl font-semibold shadow-lg"
        >
          Login
        </button>

        <p className="text-zinc-400 text-center mt-6">
          Don’t have an account?
          <Link
            to="/register"
            className="text-blue-400 ml-1 hover:underline"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;