import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import gitHiveLogo from "../../assets/gitHive.png";
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/login`, {
        email: email,
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Login Failed!");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          backgroundColor: "#111",
          transition: {
            backgroundColor: { duration: 0.25 },
            default: {
              delay: 0.1,
              type: "spring",
              stiffness: 150,
              damping: 15,
            },
          },
          y: -6,
          scale: 1.02,
          boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
        }}
        className="bg-gray-900 border border-gray-700 rounded-2xl shadow-md p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={gitHiveLogo} alt="GitHive Logo" className="h-24 w-74" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          Sign in to GitHive
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Email address
            </label>
            <input
              autoComplete="off"
              name="Email"
              id="Email"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Password</label>
            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 rounded-lg transition disabled:opacity-50 flex justify-center items-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            {loading ? "Loading..." : "Login"}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-yellow-100 text-sm">
          New to GitHive?{" "}
          <Link to="/signup" className="text-green-500 hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
