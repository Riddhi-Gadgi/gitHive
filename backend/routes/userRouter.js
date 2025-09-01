const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();

// Get all users
userRouter.get("/allUsers", userController.getAllUsers);

// Auth routes
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);

// Profile routes
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/userProfile/:id", userController.updateUserProfile);
userRouter.delete("/userProfile/:id", userController.deleteUserProfile);

module.exports = userRouter;
