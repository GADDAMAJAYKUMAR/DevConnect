const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Ensure uploads folder exists before starting the server
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Created uploads directory");
}

app.use("/uploads", express.static(uploadDir));

// Use register route
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Use post routes
const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the DevHub API");
});

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.listen(5000, () => console.log("Server running on port 5000"));
