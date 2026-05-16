import { Link } from "react-router-dom";
import { FaGlobeAsia } from "react-icons/fa";

const Register = () => {
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
          placeholder="Enter Name"
          className="w-full p-4 rounded-xl bg-zinc-900/80 border border-zinc-700 text-white outline-none mb-4 focus:border-purple-500 transition-all"
        />

        <input
          type="email"
          placeholder="Enter Email"
          className="w-full p-4 rounded-xl bg-zinc-900/80 border border-zinc-700 text-white outline-none mb-4 focus:border-purple-500 transition-all"
        />

        <input
          type="password"
          placeholder="Enter Password"
          className="w-full p-4 rounded-xl bg-zinc-900/80 border border-zinc-700 text-white outline-none mb-6 focus:border-purple-500 transition-all"
        />

        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.02] transition-all text-white p-4 rounded-xl font-semibold shadow-lg">
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