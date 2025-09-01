// backend/routes/repoRouter.js
const express = require("express");
const router = express.Router();
const repoController = require("../controllers/repoController");

// Create a new repository
router.post("/repo/create", repoController.createRepository);

// Get all repositories
router.get("/repo/all", repoController.getAllRepositories);

// Get a repository by ID
router.get("/repo/:id", repoController.fetchRepositoryById);

// Get repositories for a specific user
router.get(
  "/repo/user/:userId",
  repoController.fetchRepositoriesForCurrentUser
);

// Get repositories by name
router.get("/repo/name/:name", repoController.fetchRepositoryByName);

// Update a repository by ID
router.put("/repo/edit/:id", repoController.updateRepositoryById);

// Toggle repository visibility
router.patch("/repo/visibility/:id", repoController.toggleVisibilityById);

// Delete a repository
router.delete("/repo/:id", repoController.deleteRepositoryById);

// Get all starred repositories for a user
router.get("/repo/starred/:userId", repoController.getStarredRepositories);
router.post("/repo/star/:id", repoController.toggleStar);

module.exports = router;
