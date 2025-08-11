
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Review = require("../model/reviewmodel");
const middleware = require("../middleWare/middleware");
const reviewmodel = require("../model/reviewmodel");

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, mobile, skills } = req.body;

    // 1. Check for missing fields
    if (!name || !email || !password || !mobile || !skills) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create and save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      skills: Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim())
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. Check for missing fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // 2. Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    // 3. Check password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    // 4. Generate JWT token
    let payload = {
      user: {
        id: existingUser.id
      }
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      return  res.status(200).json({ message: "Login successful", token, user: existingUser });
    });

  } catch (error) {
    console.error("Error in /login:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Get allUser Profile Route
router.get( "/allprofile" , middleware , async(req,res) => {
  try{
    let allProfiles=await User.find();
    return res.status(200).json(allProfiles);

  }catch(error){
    console.error("Error in /profile:", error);
    res.status(500).json({ message: "Server error" });
  }
})

// Get User Profile 
router.get("/profile", middleware, async (req, res) => {
  try {
    const userProfile = await User.findById(req.user.id);
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error in /profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/addreview", middleware, async (req, res) => {
  try {
    const { taskprovider, rating } = req.body;

    // Prevent reviewing yourself
    if (taskprovider === req.user.id) {
      return res.status(400).json({ message: "You cannot review yourself" });
    }

    const newReview = new Review({
      taskprovider,
      taskWorker: req.user.id,
      rating
    });

    await newReview.save();
    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Error in /addreview:", error);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/myreviews", middleware, async (req, res) => {
  try { 
   const reviews = await reviewmodel.find()
            .populate('taskprovider', 'name')    // populate taskprovider field with user's name
            .populate('taskWorker', 'name');     // populate taskWorker field with user's name

    let userReviews = reviews.filter(review => review.taskWorker.toString() === req.user.id);
    if (userReviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this user" });
    }
    return res.status(200).json(userReviews);
  }
  catch (error) {
    console.error("Error in /myreviews:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/profile/:id", middleware, async (req, res) => {
  try {
    const userProfile = await User.findById(req.params.id)
      .populate("taskWorker", "name");
    if (!userProfile) return res.status(404).json({ message: "User not found" });
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/myreviews/:id", middleware, async (req, res) => {
  try {

    const reviews = await Review.find({ taskprovider: req.params.id }).populate('taskWorker', 'name');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
