// ========== Global Dependencies ============ // 
const _ = require('lodash');
const bcrypt = require('bcrypt');

// ========== Local Imports ============= //

const Posts = require('../models/Posts');
const Categories = require('../models/Categories');

// ========== Routing ============= //

module.exports = (app) => {

  app.get('/add-post', (req, res) => {
    if (req.cookies.userLogin) {
      Categories.find({}, (err, categories) => {
        if (err) {
          res.send(err);
        }
        res.render('pages/add-post', { title: 'Add Post', categories: categories });
      });
    } else {
      res.redirect('/login');
    }
  });

  app.post('/add-post', (req, res) => {
    req.checkBody("title", "Title is required.").notEmpty();
    req.checkBody("content", "Content is required.").notEmpty();
    req.checkBody("status", "Status is required.").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      // res.send(errors);
      res.render('pages/add-post', { 
        title: 'Add Post',
        errors: errors
      });
      return;
    } else {
      const authorId = req.cookies.userLogin['id'];
      const post = new Posts(req.body);
      console.log("req.body ", req.body);
      post.author = authorId;
      post.save((err, success) => {
        if (err) {
          // Schema Validation Errors
          if (err.errors) {
            const errors = [];
            _.forEach(err.errors, (errorFields) => {
              errors.push(errorFields.message);
            });
            res.render('pages/add-post', {
              title: 'Add Post',
              errors: errors
            });
            return;
          }
        } else {
          res.redirect('/home');
        }
        
      });
      // res.redirect('/add-post');
    }

  });

}