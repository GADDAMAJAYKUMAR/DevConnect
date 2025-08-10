const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({origin:"*"}));

// Use register route
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the DevHub API");  
});

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

app.listen(5000, () => console.log("Server running on port 5000"));
