import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import Footer from "../Footer";
const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          "https://www.eventbriteapi.com/v3/events/search/?q=tech&sort_by=date",
          {
            headers: {
              Authorization: "Bearer YOUR_EVENTBRITE_OAUTH_TOKEN",
            },
          }
        );
        const data = await res.json();

        // Eventbrite returns events in data.events array
        const eventsData = data.events.map((event) => ({
          title: event.name.text,
          date: event.start.local,
          link: event.url,
        }));

        setEvents(eventsData);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    fetchEvents();
  }, []);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log(userId);

    const fetchRepositories = async () => {
      try {
        const response = await fetch(`${API_URL}/repo/user/${userId}`);
        const data = await response.json();

        const reposArray = Array.isArray(data) ? data : [];
        setRepositories(reposArray);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
        setRepositories([]);
      }
    };
    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`${API_URL}/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />
      <section className="flex flex-col md:flex-row gap-6 p-6 bg-gray-900 min-h-screen text-gray-100">
        {/* Suggested Repositories */}
        <aside className="md:w-1/4 bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4  bg-gray-900 p-1 rounded-md border-8 border-l-yellow-500 border-gray-800">
            Public Repositories
          </h3>
          {suggestedRepositories?.map((repo) => (
            <Link key={repo._id} to={`/repo/${repo._id}`}>
              <motion.div
                className="p-3 rounded hover:bg-gray-700 cursor-pointer transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h4 className="font-medium text-gray-100">{repo.name}</h4>
                <p className="text-gray-400 text-sm">{repo.description}</p>
              </motion.div>
            </Link>
          ))}
        </aside>

        {/* Main Repositories */}
        <main className="md:w-2/4 bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4  bg-gray-900 p-1 rounded-md border-8 border-l-yellow-500 border-gray-800">
            Your Repositories
          </h3>
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search repositories..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-3">
            {searchResults.map((repo) => (
              <motion.div
                key={repo._id}
                className="p-3 border border-gray-700 rounded hover:bg-gray-700 cursor-pointer transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h4 className="font-medium text-gray-100">{repo.name}</h4>
                <p className="text-gray-400 text-sm">{repo.description}</p>
              </motion.div>
            ))}
          </div>
        </main>

        {/* Upcoming Events */}
        <aside className="md:w-1/4 bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4  bg-gray-900 p-1 rounded-md border-8 border-l-yellow-500 border-gray-800">
            Upcoming Events
          </h3>
          <ul className="space-y-2">
            {events.length > 0 ? (
              events.map((event, index) => (
                <li
                  key={index}
                  className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-all cursor-pointer"
                >
                  {event.title} - {event.date}
                </li>
              ))
            ) : (
              <li className="text-gray-400">No upcoming events</li>
            )}
          </ul>
        </aside>
      </section>
      <Footer />
    </>
  );
};

export default Dashboard;
