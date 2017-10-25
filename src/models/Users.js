const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required'
  },
  email: {
    type: String,
    required: 'Enter a valid email address.',
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  username: {
    type: String,
    required: 'Username should be 5 characters long.',
    unique: true
  },
  password: {
    type: String,
    required: 'Password should be 5 characters long.'
  },
  created_on: {
    type: Date,
    default: Date.now()
  },
  updated_on: {
    type: Date,
    default: Date.now()
  }
});

const Users = mongoose.model('Users', usersSchema);


var validateEmail = (email) => {
  const regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regEx.test(email)
};

// module.exports = Users;


module.exports.saveUser = (userInfo, callback) => {
  Users.create(userInfo, callback);
};