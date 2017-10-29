const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postsSchema = mongoose.Schema({
  author: {
    type: Schema.ObjectId,
    ref: 'Users',
    required: 'Author Id is required'
  },
  title: { 
    type: String,
    required: 'Title is required'
  },
  content: {
    type: String,
    required: 'Content is required'
  },
  image: {
    type: String
  },
  status: {
    type: Boolean,
    required: 'Status is required'
  },
  tags: {
    type: [String]
  },
  category: {
    type: String
  }
},{
    timestamps: true
});

const Posts = mongoose.model('Posts', postsSchema);

module.exports = Posts;

