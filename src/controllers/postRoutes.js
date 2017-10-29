// ========== Global Dependencies ============ // 
const _ = require('lodash');
const bcrypt = require('bcrypt');
const async = require('async');

// ========== Local Imports ============= //

const Posts = require('../models/Posts');
const Users = require('../models/Users');
const Categories = require('../models/Categories');

// ========== Routing ============= //

module.exports = (app, upload) => {

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

  app.get('/post-detail/:id', (req, res) => {
    if (req.cookies.userLogin) {
      async.waterfall([
        (callback) => {
          Posts.findById({ _id: req.params.id }, (err, post) => {
            if (err) {
              res.send(err);
            }
            callback(null, post);
          });
        },
        (post, callback) => {
          Users.findById({ _id: post.author }, (err, author) => {
            if (err) {
              res.send(err);
            }
            const payload = {
              post: post,
              author: author
            };
            callback(null, payload);
          });
        }
      ], (err, payload) => {
        // console.log("payload ", payload);
        res.render('pages/blog-detail', {
          title: 'Post Details',
          payload: payload
        });
      });
    } else {
      res.redirect('/login');
    }
  });

  app.post('/add-post', upload.single('postImage'), (req, res) => {
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
      post.author = authorId;
      post.image = req.file ? req.file.path : '';
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
    }

  });

  app.get('/delete-post/:id', (req, res) => {
    Posts.findByIdAndRemove( { _id: req.params.id }, (err, success) => {
      if (err) {
        res.send(err);
      }
      res.redirect('/home');
    });
  });

}