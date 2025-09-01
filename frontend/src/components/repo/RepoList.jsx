// src/components/RepoList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RepoList = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/repo/all");
        setRepos(res.data);
      } catch (err) {
        console.error("Error fetching repos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-400">Loading repositories...</p>;
  }

  if (repos.length === 0) {
    return <p className="text-center text-gray-400">No repositories found.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Repositories</h2>
      <div className="grid gap-4">
        {repos.map((repo) => (
          <div
            key={repo._id}
            className="bg-gray-900 p-4 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">{repo.name}</h3>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 transition">
                  <Star size={18} />
                  <span className="text-sm">Star</span>
                </button>

                {/* Edit button only visible to owner */}
                {repo.owner === currentUserId && (
                  <button
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition"
                    onClick={() => navigate(`/repo/edit/${repo._id}`)}
                  >
                    <Edit size={18} />
                    <span className="text-sm">Edit</span>
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              {repo.description || "No description provided"}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Created at: {new Date(repo.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepoList;
