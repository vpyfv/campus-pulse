const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: String,
  image: String,
  location: String,
  likedUsers: [String],
  user: { id: String, name: String, image: String },
  createdTime: { type: Date, default: Date.now },
});

const PostModel = mongoose.model("Post", postSchema);
module.exports = PostModel;
