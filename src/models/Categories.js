const mongoose = require('mongoose');

const categoriesSchema = mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required'
  },
  created_on: {
    type: Date,
    default: Date.now()
  }
});

const Categories = mongoose.model('Categories', categoriesSchema);

module.exports = Categories;

