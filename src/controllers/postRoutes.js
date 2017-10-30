// ========== Global Dependencies ============ // 
const _ = require('lodash');
const bcrypt = require('bcrypt');
const async = require('async');

// ========== Local Imports ============= //

const Posts = require('../models/Posts');
const Users = require('../models/Users');
const Categories = require('../models/Categories');
const Comments = require('../models/Comments');

// ========== Routing ============= //

module.exports = (app, upload) => {

  // ========== All GET Requests ============= //

  // Get Add Post Page
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

  // Get Post Details
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
        },
        (incomingPayload, callback) => {
          Comments.find({}).populate('author').exec( (err, success) => {
            const payload = {
              author: incomingPayload.author,
              post: incomingPayload.post,
              comments: success
            };
            callback(null, payload);
          });
        }
      ], (err, payload) => {
        res.render('pages/blog-detail', {
          title: 'Post Details',
          payload: payload,
          loggedInUser: req.cookies.userLogin['id']
        });
      });
    } else {
      res.redirect('/login');
    }
  });

  // Delete Post
  app.get('/delete-post/:id', (req, res) => {
    Posts.findByIdAndRemove({ _id: req.params.id }, (err, success) => {
      if (err) {
        res.send(err);
      }
      res.redirect('/home');
    });
  });

  // Delete Comment
  app.get('/delete-comment/:id', (req, res) => {
    Comments.findByIdAndRemove({ _id: req.params.id }, (err, success) => {
      if (err) {
        res.send(err);
      }
      res.redirect('back');
    });
  });

  // // ========== All POST Requests ============= //

  // Add Post
  app.post('/add-post', upload.single('postImage'), (req, res) => {
    req.checkBody("title", "Title is required.").notEmpty();
    req.checkBody("content", "Content is required.").notEmpty();
    req.checkBody("status", "Status is required.").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      req.flash('errors', errors);
      res.render('pages/add-post', {
        title: 'Add Post'
      });
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
              errors.push({ msg: errorFields.message });
            });
            req.flash('errors', errors);
            res.render('pages/add-post', {
              title: 'Add Post'
            });
            return;
          }
        } else {
          res.redirect('/home');
        }
      });
    }

  });

  // Add Comment
  app.post('/add-comment/:id', (req, res) => {
    let comments = new Comments(req.body);
    comments.post = req.params.id;
    comments.author = req.cookies.userLogin['id'];
    
    comments.save((err, success) => {
      if (err) {
        res.send(err);
      }
      req.flash('success', { msg: 'Comment Sent!' });
      res.redirect('back');
    });
  });

  

}