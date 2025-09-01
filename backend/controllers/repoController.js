const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const ObjectId = require("mongodb").ObjectId;

dotenv.config();

const uri = process.env.MONGO_URI;
let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
  }
}

const createRepository = async (req, res) => {
  const { owner, name, issues, content, description, visibility } = req.body;

  try {
    await connectClient();
    const db = client.db("gitHive");
    const repoCollection = db.collection("repos");

    if (!name) {
      return res.status(400).json({ error: "Repository name is required!" });
    }
    let ownerId;
    if (ObjectId.isValid(owner)) {
      ownerId = new ObjectId(owner);
    } else {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const newRepository = {
      name,
      description,
      visibility,
      owner: ownerId,
      content,
      issues,
      createdAt: new Date(),
    };

    const result = await repoCollection.insertOne(newRepository);

    res.status(201).json({
      message: "Repository created successfully",
      repositoryId: result.insertedId,
    });
  } catch (err) {
    console.error("Error during Repository creation:", err.message);
    res.status(500).send("Server error");
  }
};
const getAllRepositories = async (req, res) => {
  try {
    await connectClient();
    const db = client.db("gitHive");
    const repos = await db.collection("repos").find({}).toArray();
    res.json(repos);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error");
  }
};

const fetchRepositoryById = async (req, res) => {
  const repoId = req.params.id;
  try {
    await connectClient();
    const db = client.db("gitHive");

    // Convert repoId to ObjectId
    const repo = await db
      .collection("repos")
      .findOne({ _id: new ObjectId(repoId) });

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.json(repo);
  } catch (err) {
    console.error("Error during fetching:", err.message);
    res.status(500).send("Server error");
  }
};

const fetchRepositoryByName = async (req, res) => {
  const repoName = req.params.name;
  try {
    await connectClient();
    const db = client.db("gitHive");

    const repos = await db
      .collection("repos")
      .find({ name: repoName })
      .toArray();

    if (!repos || repos.length === 0) {
      return res
        .status(404)
        .json({ message: "No repositories found with this name" });
    }

    res.json(repos);
  } catch (err) {
    console.error("Error during fetching:", err.message);
    res.status(500).send("Server error");
  }
};
const fetchRepositoriesForCurrentUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    await connectClient();
    const db = client.db("gitHive");

    const repos = await db
      .collection("repos")
      .find({ owner: { $in: [new ObjectId(userId)] } })
      .toArray();

    if (!repos || repos.length === 0) {
      return res
        .status(404)
        .json({ message: "No repositories found for this user" });
    }

    res.json(repos || []);
  } catch (err) {
    console.error("Error fetching repositories:", err.message);
    res.status(500).send("Server error");
  }
};

const updateRepositoryById = async (req, res) => {
  const repoId = req.params.id;
  const updateData = req.body;

  try {
    if (!ObjectId.isValid(repoId)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }

    await connectClient();
    const db = client.db("gitHive");

    const result = await db
      .collection("repos")
      .updateOne({ _id: new ObjectId(repoId) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.json({ message: "Repository updated successfully" });
  } catch (err) {
    console.error("Error updating repository:", err.message);
    res.status(500).send("Server error");
  }
};

const toggleVisibilityById = async (req, res) => {
  const repoId = req.params.id;

  try {
    await connectClient();
    const db = client.db("gitHive");

    const repo = await db
      .collection("repos")
      .findOne({ _id: new ObjectId(repoId) });

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const newVisibility = repo.visibility === "public" ? "private" : "public";

    await db
      .collection("repos")
      .updateOne(
        { _id: new ObjectId(repoId) },
        { $set: { visibility: newVisibility } }
      );

    res.json({ message: `Repository visibility changed to ${newVisibility}` });
  } catch (err) {
    console.error("Error toggling visibility:", err.message);
    res.status(500).send("Server error");
  }
};

const deleteRepositoryById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }

    await connectClient();
    const db = client.db("gitHive");

    const result = await db
      .collection("repos")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.json({ message: "Repository deleted successfully" });
  } catch (err) {
    console.error("Error deleting repository:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const toggleStar = async (req, res) => {
  const { id } = req.params; // Repo ID from URL
  const { userId } = req.body; // Logged-in user ID

  try {
    await connectClient();
    const db = client.db("gitHive");

    const repo = await db
      .collection("repos")
      .findOne({ _id: new ObjectId(id) });
    if (!repo) return res.status(404).json({ message: "Repo not found" });

    let newStars;
    if (repo.stars?.includes(userId)) {
      // Remove star
      newStars = repo.stars.filter((u) => u !== userId);
    } else {
      // Add star
      newStars = [...(repo.stars || []), userId];
    }

    await db
      .collection("repos")
      .updateOne({ _id: new ObjectId(id) }, { $set: { stars: newStars } });

    res.json({ stars: newStars });
  } catch (err) {
    console.error("Error toggling star:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const getStarredRepositories = async (req, res) => {
  const { userId } = req.params;

  try {
    await connectClient();
    const db = client.db("gitHive");

    const starredRepos = await db
      .collection("repos")
      .find({ stars: { $in: [userId] } })
      .toArray();

    res.json(starredRepos);
  } catch (err) {
    console.error("Error fetching starred repos:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoriesForCurrentUser,
  fetchRepositoryById,
  fetchRepositoryByName,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
  getStarredRepositories,
  toggleStar,
};
