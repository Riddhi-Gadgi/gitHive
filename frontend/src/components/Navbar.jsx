import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gitHiveLogo from "../assets/gitHive.png";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 shadow-md px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <motion.img
          src={gitHiveLogo}
          alt="GitHive logo Logo"
          className="h-14 w-44"
        />
      </Link>

      {/* Navigation Links */}
      <div className="flex space-x-6">
        <Link to="/repo/create">
          <motion.p
            className="text-gray-800 hover:text-gray-800 font-bold bg-yellow-500 p-2 rounded-md cursor-pointer transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create a Repository
          </motion.p>
        </Link>
        <Link to="/profile">
          <motion.p
            className="text-gray-800 hover:text-gray-800 font-bold bg-yellow-500 p-2 rounded-md cursor-pointer transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Profile
          </motion.p>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
