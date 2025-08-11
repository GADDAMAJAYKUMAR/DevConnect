const mongoose=require('mongoose');

const postSchema=new mongoose.Schema({
     author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     description: { type: String, required: true },
     images: [{ type: String }],
     createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);