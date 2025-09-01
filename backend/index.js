const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const appRouter = require("./routes/AppRouters");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
// const { pushRepo } = require("./controllers/push");
// const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Strarting server", {}, startServer)
  .command("init", "Initialise a new Repository", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to the Repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the statging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  // .command("push", "Push commits to S3", {}, pushRepo)
  // .command("pull", "Push commits to S3", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitId", {
        describe: "Commit Id revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, "You need at least one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3002;

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS
  app.use(cors({ origin: "*" }));

  //appRouter
  app.use("/", appRouter);

  // MongoDB connection
  const mongoURI = process.env.MONGO_URI;
  mongoose
    .connect(mongoURI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("Unable to connect", err));

  // Basic route
  app.get("/", (req, res) => {
    res.send("Welcome");
  });

  // Socket.io setup
  let user = "test"; // use let because it can change
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log("=====");
      console.log(user);
      console.log("=====");
      socket.join(userID);
    });
  });

  // Optional: MongoDB CRUD operations when connection is open
  const db = mongoose.connection;
  db.once("open", async () => {
    console.log("CRUD operations called");
  });

  // Start server
  httpServer.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
  });
}
