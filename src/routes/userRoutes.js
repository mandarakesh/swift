const express = require("express");
const axios = require("axios");
const { db } = require("../database/database");
const router = express.Router();

router.get("/load", async (req, res) => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    const users = response.data;
    //for each user adding posts
    for (const user of users) {
      const postsResponse = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?userId=${user.id}`
      );
      const posts = postsResponse.data;
      //for each post adding comments

      for (const post of posts) {
        const commentsResponse = await axios.get(
          `https://jsonplaceholder.typicode.com/comments?postId=${post.id}`
        );
        post.comments = commentsResponse.data;
      }
      //inserting each user in the data base
      user.posts = posts;
      await db.collection("users").insertOne(user);
    }

    res.status(200).send("Users Data Inserted SuccessFully from the api");
  } catch (error) {
    console.error("Error loading users", error);
    res.status(500).send("Internal Server Error");
  }
});

//get all the users in the database
router.get("/users", async (req, res) => {
  try {
    const users = await db.collection("users").find().toArray();

    if (!users) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user", error);
    res.status(500).send("Internal Server Error");
  }
});

//get the user in the database based on userid
router.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await db.collection("users").findOne({ id: parseInt(userId) });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user", error);
    res.status(500).send("Internal Server Error");
  }
});

//update the user based on userid

router.put("/users", async (req, res) => {
  const newUser = req.body;

  try {
    const existingUser = await db
      .collection("users")
      .findOne({ id: newUser.id });

    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    await db.collection("users").insertOne(newUser);
    res.status(201).send("User created");
  } catch (error) {
    console.error("Error creating user", error);
    res.status(500).send("Internal Server Error");
  }
});

//delete all the users in the database

router.delete("/users", async (req, res) => {
  try {
    await db.collection("users").deleteMany({});
    res.status(200).send("All users deleted");
  } catch (error) {
    console.error("Error deleting users", error);
    res.status(500).send("Internal Server Error");
  }
});

//delete user based on userid

router.delete("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await db
      .collection("users")
      .deleteOne({ id: parseInt(userId) });

    if (result.deletedCount === 0) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User deleted");
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
