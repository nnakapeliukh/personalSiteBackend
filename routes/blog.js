const mongoose = require("mongoose");
const User = require("../models/userModel");
const BlogPost = require("../models/blogpostModel")
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
router.post("/create", async (req, res, next) => {
    try{
        console.log("CRESTING POST");
        let newPost = new BlogPost({
            title: "First post",
            description: "Short description",
            post_text: "Some text",
            post_date: Date.now(),            
        })
        await newPost.save();
        res.status(200).json(newPost);
    } catch(e){
        console.log(e);
    }
});

router.get("/", async (req, res, next) => {
  try {   
    const posts = await BlogPost.find().sort({date: -1}).limit(5);
    console.log(posts);
    res.json(posts);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
