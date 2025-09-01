import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gitHiveLogo from "../assets/gitHive.png";
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
        {/* Logo and Tagline */}
        <div className="flex flex-col space-y-2">
            <Link to="/" className="flex items-center space-x-2">
                <motion.img
                  src={gitHiveLogo}
                  alt="GitHive logo Logo"
                  className="h-14 w-44"
                />
              
          </Link>
          <p className="text-gray-400 text-sm">
            Explore, Create & Share Your Repositories
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-2">
          <h4 className="text-yellow-500 font-semibold">Quick Links</h4>
          <Link
            to="/repo/create"
            className="hover:text-yellow-400 transition-colors"
          >
            Create Repository
          </Link>
          <Link
            to="/profile"
            className="hover:text-yellow-400 transition-colors"
          >
            Profile
          </Link>
          <Link
            to="/dashboard"
            className="hover:text-yellow-400 transition-colors"
          >
            Dashboard
          </Link>
        </div>

        {/* Social Links */}
        {/* <div className="flex flex-col space-y-2">
          <h4 className="text-yellow-500 font-semibold">Connect with us</h4>
          <div className="flex space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition-colors"
            >
              <GitHub size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div> */}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-6 py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} GitHive. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
