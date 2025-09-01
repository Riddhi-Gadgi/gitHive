const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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

// Get all users
const getAllUsers = async (req, res) => {
  try {
    await connectClient();
    const db = client.db("gitHive");
    const users = await db.collection("users").find({}).toArray();
    res.json(users);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error");
  }
};

// Signup
const signup = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    await connectClient();
    const db = client.db("gitHive");
    const userCollection = db.collection("users");

    const existingUser = await userCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists !" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await userCollection.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token, userId: result.insertedId });
  } catch (err) {
    console.error("Error during signup : ", err.message);
    res.status(500).send("Server error");
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    await connectClient();
    const db = client.db("gitHive");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Error during login : ", err.message);
    res.status(500).send("Server error..!");
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  const { id: currentId } = req.params;
  try {
    await connectClient();
    const db = client.db("gitHive");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ _id: new ObjectId(currentId) });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      followers: user.followedUsers?.length || 0,
      following: user.following?.length || 0,
      starRepos: user.starRepos || [],
      repositories: user.repositories || [],
    });
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error");
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { id: currentId } = req.params;
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("gitHive");
    const userCollection = db.collection("users");

    let updateFields = {};
    if (email) updateFields.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const result = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(currentId) },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json(result.value);
  } catch (err) {
    console.error("Error during updating profile: ", err.message);
    res.status(500).send("Server error");
  }
};

// Delete user profile
const deleteUserProfile = async (req, res) => {
  const { id: currentId } = req.params;
  try {
    await connectClient();
    const db = client.db("gitHive");
    const userCollection = db.collection("users");

    const result = await userCollection.deleteOne({
      _id: new ObjectId(currentId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User profile deleted successfully" });
  } catch (err) {
    console.error("Error during deleting profile: ", err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
