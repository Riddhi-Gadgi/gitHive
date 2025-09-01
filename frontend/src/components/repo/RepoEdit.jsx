// src/pages/RepoEdit.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import { motion } from "framer-motion";

const RepoEdit = () => {
  const { id } = useParams(); // repoId from route
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const accentColor = "#F6C85F";

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await axios.get(`http://localhost:3002/repo/${id}`);
        const repo = res.data;
        setName(repo.name || "");
        setDescription(repo.description || "");
        setContent(repo.content || "");
        setVisibility(repo.visibility || "public");
      } catch (err) {
        console.error("Error fetching repository:", err);
        setError(err.response?.data?.message || "Failed to fetch repository");
      }
    };

    fetchRepo();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        content,
        visibility,
      };

      const res = await axios.put(
        `http://localhost:3002/repo/edit/${id}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      setLoading(false);
      navigate(`/repo/${id}`); // redirect to repo view
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to update repository");
      console.error("Update repo error:", err);
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
            Edit Repository
          </h1>

          {error && (
            <div className="mb-4 text-sm text-red-400 bg-red-900/20 border border-red-700 p-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Repository Name *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Repository name"
                className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
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
                placeholder="Short description"
                className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Readme / Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="# Hello World"
                className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Visibility
              </label>
              <div className="flex space-x-4 mt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={visibility === "public"}
                    onChange={() => setVisibility("public")}
                    className="accent-yellow-400"
                  />
                  <span className="text-gray-200 text-sm">Public</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={visibility === "private"}
                    onChange={() => setVisibility("private")}
                    className="accent-yellow-400"
                  />
                  <span className="text-gray-200 text-sm">Private</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end mt-4 space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-gray-200"
              >
                Cancel
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
                {loading ? "Updating..." : "Update Repository"}
              </motion.button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RepoEdit;
