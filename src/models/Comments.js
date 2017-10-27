const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = mongoose.Schema({
  post: Schema.ObjectId,
  content: String,
  author: Schema.ObjectId
},{
    timestamps: true
});

const Comments = mongoose.model('Comments', commentsSchema);

module.exports = Comments;

