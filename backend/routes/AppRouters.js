const express = require("express");
const userRouter = require("./userRouter");
const repoRouter = require("./repoRouter");
const issueRouter = require("./issueRouter");
const appRouter = express.Router();

appRouter.use(userRouter);
appRouter.use(repoRouter);
appRouter.use(issueRouter);

appRouter.get("/", (req, res) => {
  res.send("Welcome");
});

module.exports = appRouter;
