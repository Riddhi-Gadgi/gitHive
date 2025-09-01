// src/pages/RepoView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const RepoView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [starring, setStarring] = useState(false);

  const currentUserId = localStorage.getItem("userId");

  // Fetch repo data
  useEffect(() => {
    const fetchRepo = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/repo/${id}`);
        setRepo(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Repository not found or server error");
        setLoading(false);
      }
    };
    fetchRepo();
  }, [id]);

  // Star / Unstar repo
  const handleStar = async () => {
    if (!currentUserId || starring) return;

    try {
      setStarring(true);
      const res = await axios.post(`${API_URL}/repo/star/${id}`, {
        userId: currentUserId,
      });

      // Update only the stars array
      setRepo((prevRepo) => ({ ...prevRepo, stars: res.data.stars }));
    } catch (err) {
      console.error("Star action failed:", err);
    } finally {
      setStarring(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this repository?"))
      return;

    try {
      await axios.delete(`${API_URL}:3002/repo/delete/${id}`);
      alert("Repository deleted successfully!");

      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete repository");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <p>Loading repository...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        <p>{error}</p>
      </div>
    );

  // Ensure both are strings for comparison
  const isStarred = repo.stars?.includes(currentUserId);
  const isOwner = repo.owner?._id
    ? repo.owner._id === currentUserId
    : repo.owner === currentUserId;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Repo Header */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-yellow-500 mb-2">
              {repo.name}
            </h1>
            <p className="text-gray-400 mb-4">
              {repo.description || "No description provided"}
            </p>
            <div className="text-sm text-gray-300">
              Owner:{" "}
              <span className="font-medium">
                {repo.owner?.username || repo.owner}
              </span>{" "}
              | Visibility:{" "}
              <span className="font-medium">
                {repo.visibility ? "Public" : "Private"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {/* Edit Button: only owner */}
            {isOwner && (
              <button
                onClick={() => navigate(`/repo/edit/${id}`)}
                className="px-4 py-2 rounded bg-gray-900 hover:bg-gray-600 text-white font-semibold"
              >
                Edit
              </button>
            )}
            {/* Delete Button: only owner */}
            {isOwner && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-gray-900 hover:bg-gray-600 text-white font-semibold"
              >
                Delete
              </button>
            )}

            {/* Star/Unstar Button */}
            <button
              onClick={handleStar}
              className={`flex items-center gap-1 px-4 py-2 rounded font-semibold transition ${
                starring ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={starring}
            >
              <Star
                size={18}
                color={isStarred ? "#F6C85F" : "#FFFFFF"}
                fill={isStarred ? "#F6C85F" : "none"}
              />
              {/* {isStarred ? "Unstar" : "Star"} */}
              <span className="ml-2 text-sm text-gray-200">
                {repo.stars?.length || 0}
              </span>
            </button>
          </div>
        </div>

        {/* README / Content */}
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-semibold mb-2 text-yellow-400">
            README / Content
          </h2>
          <pre className="bg-gray-700 p-4 rounded text-gray-100 overflow-x-auto">
            {repo.content || "No content available"}
          </pre>
        </motion.div>

        {/* Issues */}
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-semibold mb-2 text-yellow-400">
            Issues
          </h2>
          {repo.issues && repo.issues.length > 0 ? (
            <ul className="space-y-3">
              {repo.issues.map((issue, index) => (
                <li
                  key={index}
                  className="p-3 rounded bg-gray-700 hover:bg-gray-600 transition-all cursor-pointer"
                >
                  <h3 className="font-medium">{issue.title}</h3>
                  <p className="text-gray-400 text-sm">{issue.description}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    Status: {issue.status || "Open"}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No issues created yet.</p>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default RepoView;
