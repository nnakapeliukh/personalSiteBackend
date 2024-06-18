const mongoose = require("mongoose");
const User = require("../models/userModel");
const BlogPost = require("../models/blogpostModel");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { validationResult, body } = require("express-validator");

const bcrypt = require("bcrypt");
const verifyToken = require("./authanticate");

// eslint-disable-next-line no-undef
let uri = `${process.env.MONGO_URL}`;
mongoose.connect(uri, { dbName: "usersdb" });

// create new blog post
router.post("/create", verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    console.log("CRESTING POST");
    let newPost = new BlogPost({
      title: "First post",
      description: "Short description",
      post_text: "Some text",
      post_date: Date.now(),
      user: user,
    });
    await newPost.save();
    res.status(200).json(newPost);
  } catch (e) {
    console.log(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const posts = await BlogPost.find()
      .populate("user")
      .sort({ date: -1 })
      .limit(5);
    /** get the data to send back, for the main blog
     *  post page only post title, post description, 
     * tags, post date and user  name needed */
    dataToSend = posts.map((post) => {
      return {
        title: post.title,
        description: post.description,
        post_date: post.post_date,
        tags: post.tags,
        user_name: post.user.user_name,
        id: post._id
      };
    });
    console.log(dataToSend);
    res.json(dataToSend);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
