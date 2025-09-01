// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";
import { Book, Star } from "lucide-react";
const API_URL = process.env.REACT_APP_API_URL;
const Profile = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const [userDetails, setUserDetails] = useState({
    username: "username",
    followers: 0,
    following: 0,
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [isFollowing, setIsFollowing] = useState(false);
  const [starredRepos, setStarredRepos] = useState([]);

  const accentColor = "#F6C85F";

  const userId = localStorage.getItem("userId");

  // Fetch user details
  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/userProfile/${userId}`);
        const user = response.data;

        setUserDetails({
          username: user.username,
          followers: user.followedUsers?.length || 0,
          following: user.following?.length || 0,
        });
        setIsFollowing(user.followedUsers?.includes(userId));
      } catch (err) {
        console.error("Cannot fetch user details: ", err);
      }
    };
    fetchUserDetails();
  }, [userId]);

  // Fetch starred repositories when tab is active
  useEffect(() => {
    if (activeTab !== "starred" || !userId) return;

    const fetchStarredRepos = async () => {
      try {
        const res = await axios.get(`${API_URL}/repo/starred/${userId}`);
        setStarredRepos(res.data);
      } catch (err) {
        console.error("Cannot fetch starred repos:", err);
      }
    };
    fetchStarredRepos();
  }, [activeTab, userId]);

  // Follow / Unfollow
  const handleFollow = async () => {
    try {
      const response = await axios.post(`${API_URL}/follow/${userId}`, {
        follow: !isFollowing,
      });
      setIsFollowing(!isFollowing);
      setUserDetails((prev) => ({
        ...prev,
        followers: response.data.followers,
      }));
    } catch (err) {
      console.error("Follow action failed:", err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    window.location.href = "/auth";
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <Navbar />

      {/* Tabs */}
      <div className="px-6 mt-4 flex space-x-6 border-b border-gray-700">
        {/* Overview Tab */}
        <div
          className={`flex items-center space-x-2 pb-2 cursor-pointer ${
            activeTab === "overview"
              ? "border-b-2 text-white"
              : "text-gray-400 hover:text-white"
          }`}
          style={activeTab === "overview" ? { borderColor: accentColor } : {}}
          onClick={() => setActiveTab("overview")}
        >
          <Book
            size={18}
            color={activeTab === "overview" ? accentColor : undefined}
          />
          <span
            style={{
              color: activeTab === "overview" ? accentColor : undefined,
            }}
          >
            Overview
          </span>
        </div>

        {/* Starred Repos Tab */}
        <div
          className={`flex items-center space-x-2 pb-2 cursor-pointer ${
            activeTab === "starred"
              ? "border-b-2 text-white"
              : "text-gray-400 hover:text-white"
          }`}
          style={activeTab === "starred" ? { borderColor: accentColor } : {}}
          onClick={() => setActiveTab("starred")}
        >
          <Star
            size={18}
            color={activeTab === "starred" ? accentColor : undefined}
          />
          <span
            style={{
              color: activeTab === "starred" ? accentColor : undefined,
            }}
          >
            Starred Repositories
          </span>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="fixed bottom-12 right-12 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all"
      >
        Logout
      </button>

      {/* Profile Section */}
      <div className="profile-page-wrapper flex flex-col md:flex-row gap-6 px-6 mt-6">
        {/* User Info */}
        <div className="user-profile-section flex flex-col items-center md:w-1/3 bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="profile-image w-22 h-22 bg-yellow-600 rounded-full mb-4"></div>
          <div className="name mb-4 text-center">
            <h3 className="text-xl font-semibold">{userDetails.username}</h3>
          </div>

          {/* Follow Button */}
          <button
            onClick={handleFollow}
            className="follow-btn px-6 py-2 rounded-lg mb-4 transition-all font-semibold"
            style={{
              backgroundColor: isFollowing ? "#555" : accentColor,
              color: isFollowing ? "#fff" : "#1f2937",
            }}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>

          {/* Followers / Following */}
          <div className="follower flex space-x-6 text-gray-300">
            <p>{userDetails.followers} Followers</p>
            <p>{userDetails.following} Following</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-2/3 space-y-6">
          {activeTab === "overview" && (
            <div className="heat-map-section bg-gray-800 p-6 rounded-lg shadow-md">
              <HeatMapProfile />
            </div>
          )}

          {activeTab === "starred" && (
            <div className="starred-repos bg-gray-800 p-6 rounded-lg shadow-md">
              {starredRepos.length === 0 ? (
                <p className="text-gray-400">
                  You haven’t starred any repositories yet.
                </p>
              ) : (
                <div className="grid gap-4">
                  {starredRepos.map((repo) => (
                    <div
                      key={repo._id}
                      className="bg-gray-900 p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                      onClick={() => navigate(`/repo/${repo._id}`)}
                    >
                      <h3 className="text-lg font-semibold text-yellow-400">
                        {repo.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {repo.description || "No description"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
