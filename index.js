/*jshint esversion: 8 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const pinoLogger = require('pino');

// const { loadData } = require("./util/import-mongo/index");

const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blog");

const app = express();
app.use("*", cors());
const port = 3060;

// Connect to MongoDB; we just do this one time
app.use(express.json());

// const pinoHttp = require("pino-http");

// app.use(pinoHttp({ logger }));

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/blog", blogRoutes);
// Global Error Handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

app.get("/", (req, res) => {
  res.send("Inside the server");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
