const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = mongoose.Schema({
  post: {
    type: Schema.ObjectId,
    ref: 'Posts'
  },
  content: String,
  author: {
    type: Schema.ObjectId,
    ref: 'Users'
  }
},{
    timestamps: true
});

const Comments = mongoose.model('Comments', commentsSchema);

module.exports = Comments;

