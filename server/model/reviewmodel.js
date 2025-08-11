const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  taskprovider: {
    type: Schema.Types.ObjectId,
    ref: "User",  // Reference to User model
    required: true,
  },
  taskWorker: {
    type: Schema.Types.ObjectId,
    ref: "User",  // Reference to User model
    required: true,
  },
  rating: {
    type: Number,  // Use Number for ratings (1-5)
    required: true,
  },
});

module.exports = mongoose.model("reviewmodel", reviewSchema);
