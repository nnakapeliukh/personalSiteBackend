const mongoose = require("mongoose");
const User = require("../models/userModel");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { validationResult, body } = require("express-validator");

const bcrypt = require("bcrypt");

// eslint-disable-next-line no-undef
let uri = `${process.env.MONGO_URL}`;
mongoose.connect(uri, { dbName: "usersdb" });

// router.get("/", async (req, res) => {
//   try {
//   } catch (e) {
//     console.error("Error fetching users:", e);
//     res.status(500).send("Error fetching users");
//   }
// });

// router.get("/:id", async (req, res) => {
//   try {
//     // Task 1: Connect to MongoDB and store connection to db constant
//     const db = await connectToDatabase();
//     // Task 2: use the collection() method to retrieve the gift collection
//     const collection = db.collection("gifts");

//     const id = req.params.id;

//     // Task 3: Find a specific gift by ID using the collection.fineOne method and store in constant called gift
//     const gift = await collection.findOne({ id: id });

//     if (!gift) {
//       return res.status(404).send("Gift not found");
//     }

//     res.json(gift);
//   } catch (e) {
//     console.error("Error fetching gift:", e);
//     res.status(500).send("Error fetching gift");
//   }
// });

// login
router.post(
  "/login",
  [
    body("email")
      .trim()
      .escape(),
    body("password")
      .trim()
      .escape(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors
      const errorMessage = errors.errors.map(
        (err) => err.value + " " + err.msg
      );
      res.status(400).json(errorMessage);
    } else {
      //no parsing errors
      const allUsers = await User.find({});
      const matchedUser = allUsers.filter((user) =>
        bcrypt.compareSync(req.body.email, user.email)
      ); // true)
      const isPwdMatched = matchedUser
        ? bcrypt.compareSync(req.body.password, matchedUser[0].password)
        : false;

      if (isPwdMatched) {
        // User authenticated, generate token
        const token = jwt.sign(
          { id: matchedUser.id, username: matchedUser.username },
          `${process.env.JWT_SECRET}`
        );
        // res.json({ token });
        res.cookie('token', token, { httpOnly: true });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    }
  }
);

// Add a new user
router.post(
  "/",
  [
    body("firstName")
      .isLength({ min: 3 })
      .withMessage("Must be >3 chars")
      .isAlpha()
      .withMessage("Must be only alphabetical chars")
      .trim()
      .escape(),
    body("lastName")
      .isLength({ min: 3 })
      .withMessage("Must be >3 chars")
      .isAlpha()
      .withMessage("Must be only alphabetical chars")
      .trim()
      .escape(),
    body("username")
      .isLength({ min: 3 })
      .withMessage("Must be >3 chars")
      .isAlphanumeric()
      .withMessage("Must be only alphabetical chars")
      .trim()
      .escape(),
    body("email")
      .isLength({ min: 3 })
      .withMessage("Must be >3 chars")
      .isEmail()
      .withMessage("Must be email")
      .trim()
      .escape(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Must be >3 chars")
      .trim()
      .escape(),
    body("city")
      .isLength({ min: 2 })
      .withMessage("Must be >2 chars")
      .isAlphanumeric()
      .withMessage("Must be only alphabetical chars")
      .trim()
      .escape(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors
      const errorMessage = errors.errors.map(
        (err) => err.value + " " + err.msg
      );
      res.status(400).json(errorMessage);
    } else {
      // Data from form is valid.
      let passHash = bcrypt.hashSync(req.body.password, 5);
      let emailHash = bcrypt.hashSync(req.body.email, 5);

      try {
        const allUsers = await User.find({});
        const matchedUser = allUsers.filter((user) =>
          bcrypt.compareSync(req.body.email, user.email)
        ); // true)
        //  const isPwdMatched = matchedUser ? bcrypt.compareSync(req.body.password, matchedUser[0].password) : false;
        if (!matchedUser) {
          let newUser = new User({
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            user_name: req.body.username,
            email: emailHash,
            password: passHash,
            city: req.body.city,
          });
          await newUser.save();

          res.status(201).json(newUser);
        } else {
          res.status(400).json(["Email exists"]);
        }
      } catch (e) {
        next(e);
      }
    }
  }
);

module.exports = router;