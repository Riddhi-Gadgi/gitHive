// src/pages/CreateRepo.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../Navbar";
const API_URL = import.meta.env.VITE_API_URL;

const CreateRepo = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [repoName, setRepoName] = useState("");
  const [repoDesc, setRepoDesc] = useState("");
  const accentColor = "#F6C85F";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const owner = localStorage.getItem("userId");
    if (!owner) {
      setError("You must be logged in to create a repository.");
      return;
    }

    if (!name.trim()) {
      setError("Repository name is required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        owner,
        name: name.trim(),
        description: description.trim(),
        content,
        visibility: isPublic,
        issues: [],
      };

      const res = await axios.post(`${API_URL}/repo/create`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setLoading(false);

      // backend returns { message, repositoryId }
      const repoId = res?.data?.repositoryId;

      if (repoId) navigate(`/repo/${repoId}`);
      else navigate("/repo"); // fallback
    } catch (err) {
      setLoading(false);
      if (err.response?.data?.error) setError(err.response.data.error);
      else if (err.response?.data?.message) setError(err.response.data.message);
      else setError("Failed to create repository. Check server logs.");
      console.error("Create repo error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />

      <main className="max-w-3xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h1
            className="text-2xl font-semibold mb-2"
            style={{ color: accentColor }}
          >
            Create a Repository
          </h1>
          <p className="text-gray-400 mb-6">
            Create a new repo for your project.
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-400 bg-red-900/20 border border-red-700 p-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Repository name *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="my-awesome-repo"
                className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-opacity-75"
                style={{ borderColor: "#2f2f2f" }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Description
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of repository"
                className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Readme / Initial content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="# Hello world"
                className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2"
              />
            </div>

            {/* Visibility */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <label className="block text-sm text-gray-300">
                    Visibility
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        checked={isPublic}
                        onChange={() => setIsPublic(true)}
                        className="accent-yellow-400"
                      />
                      <span className="text-sm text-gray-200">Public</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        checked={!isPublic}
                        onChange={() => setIsPublic(false)}
                        className="accent-yellow-400"
                      />
                      <span className="text-sm text-gray-200">Private</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-400">
                owner:{" "}
                <span className="text-gray-200">
                  {localStorage.getItem("userId") || "Not logged in"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-400">
                All fields optional except name.
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    // reset form
                    setName("");
                    setDescription("");
                    setContent("");
                    setIsPublic(true);
                    setError(null);
                  }}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-gray-200"
                >
                  Reset
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded font-semibold"
                  style={{
                    backgroundColor: loading ? "#9e9e9e" : accentColor,
                    color: "#1f2937",
                    opacity: loading ? 0.8 : 1,
                  }}
                >
                  {loading ? "Creating..." : "Create Repository"}
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateRepo;
