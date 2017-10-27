const mongoose = require('mongoose');

const categoriesSchema = mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required'
  }
});