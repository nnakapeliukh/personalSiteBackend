const mongoose = require("mongoose");
const UserModel = require("./userModel");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: UserModel,
    required: true,
  },
});

const CommentModel = mongoose.model("comments", commentSchema);

module.exports = CommentModel;
