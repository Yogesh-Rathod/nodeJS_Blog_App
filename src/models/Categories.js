const mongoose = require('mongoose');

const categoriesSchema = mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required'
  }
},{
    timestamps: true
});

const Categories = mongoose.model('Categories', categoriesSchema);

module.exports = Categories;

