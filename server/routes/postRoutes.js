const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const postModel = require('../model/postmodel');
const Like = require('../model/like');
const Comment = require('../model/comment');
const middleware = require('../middleWare/middleware');

// Multer setup: store uploads in 'uploads/' folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST add new post with images
router.post('/addPost', middleware, upload.array('images', 5), async (req, res) => {
  try {
    const userId = req.user.id;
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    // Build array of image URLs
    const imageUrls = req.files.map(
      (file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    );

    const newPost = new postModel({
      author: userId,
      description,
      images: imageUrls,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all posts with pagination
router.get('/getallposts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await postModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatarUrl')
      .lean();

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await Like.countDocuments({ post: post._id });
        const commentsCount = await Comment.countDocuments({ post: post._id });
        return {
          ...post,
          likesCount,
          commentsCount,
        };
      })
    );

    res.json(postsWithCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Serve uploaded images statically
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = router;
