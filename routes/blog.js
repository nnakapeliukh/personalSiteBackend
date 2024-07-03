const mongoose = require("mongoose");
const User = require("../models/userModel");
const BlogPost = require("../models/blogpostModel");
const express = require("express");
const router = express.Router();
// const jwt = require("jsonwebtoken");

const { validationResult, body } = require("express-validator");

// const bcrypt = require("bcrypt");
const verifyToken = require("./authanticate");

// eslint-disable-next-line no-undef
let uri = `${process.env.MONGO_URL}`;
mongoose.connect(uri, { dbName: "usersdb" });

// create new blog post
router.post(
  "/create",
  verifyToken,
  [
    body("title")
      .isLength({ min: 5 })
      .withMessage("Must be >5 chars")
      .isAlphanumeric()
      .withMessage("Must be only alphanumeric chars")
      .trim()
      .escape(),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Must be >5 chars")
      .isAlphanumeric()
      .withMessage("Must be only alphanumeric chars")
      .trim()
      .escape(),
    body("text")
      .isLength({ min: 1 })
      .withMessage("Must be >1 chars")
      .isAlphanumeric()
      .withMessage("Must be only alphabetical chars")
      .trim()
      .escape(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // There are errors
        const errorMessage = errors.errors.map(
          (err) => err.value + " " + err.msg
        );
        res.status(400).json(errorMessage);
      } else {
        // Data from form is valid

        const user = await User.findById(req.user.id);

        console.log("CREATING POST");
        let newPost = new BlogPost({
          title: req.body.title,
          description: req.body.description,
          post_text: req.body.text,
          post_date: Date.now(),
          user: user,
        });
        await newPost.save();
        res.status(200).json(newPost);
      }
    } catch (e) {
      console.log(e);
      res.status(400).json(e.errorMessage);
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .populate("user")
      .sort({ date: -1 })
      .limit(5);
    /** get the data to send back, for the main blog
     *  post page only post title, post description,
     * tags, post date and user  name needed */
    const dataToSend = posts.map((post) => {
      return {
        title: post.title,
        description: post.description,
        post_date: post.post_date,
        tags: post.tags,
        user_name: post.user.user_name,
        id: post._id,
      };
    });
    console.log(dataToSend);
    res.json(dataToSend);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
