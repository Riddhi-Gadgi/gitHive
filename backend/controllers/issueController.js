const mongoose = require("mongoose");
const Issue = require("../models/issueModel"); // adjust path to your model

// Create Issue
const createIssue = async (req, res) => {
  try {
    const issueData = req.body;

    const newIssue = await Issue.create({
      ...issueData,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Issue created", issue: newIssue });
  } catch (err) {
    console.error("Error creating issue:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Issue by ID
const updateIssueByID = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid issue ID" });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedIssue)
      return res.status(404).json({ message: "Issue not found" });

    res.json({ message: "Issue updated", issue: updatedIssue });
  } catch (err) {
    console.error("Error updating issue:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Issue by ID
const deleteIssueById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid issue ID" });
    }

    const deleted = await Issue.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({ message: "Issue deleted successfully" });
  } catch (err) {
    console.error("Error deleting issue:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Issues (with repo populated)
const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate("repository"); // repo details
    res.json(issues);
  } catch (err) {
    console.error("Error fetching issues:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Issue by ID (with repo populated)
const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid issue ID" });
    }

    const issue = await Issue.findById(id).populate("repository");

    if (!issue) return res.status(404).json({ message: "Issue not found" });

    res.json(issue);
  } catch (err) {
    console.error("Error fetching issue:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createIssue,
  updateIssueByID,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
