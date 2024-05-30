const mongoose = require("mongoose");
const UserModel = require("./userModel");
const CommentModel = require("./commentModel");

const Schema = mongoose.Schema;

const blogpostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  post_text: {
    type: String,
    required: true,
  },
  post_date: {
    type: Date,
    required: true,
  },
  post_modified_date: {
    type: Date,
  },
  tags: {
    type: [String],
  },
  user: {    
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
});

const BlogpostModel = mongoose.model("Blogpost", blogpostSchema);

module.exports = BlogpostModel;
