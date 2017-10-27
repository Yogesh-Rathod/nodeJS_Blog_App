// ========== Global Dependencies ============ // 
const _ = require('lodash');
const bcrypt = require('bcrypt');

// ========== Local Imports ============= //

const Users = require('../models/Users');
const Categories = require('../models/Categories');

const sendMail = require('./mailer');

// ========== Routing ============= //

module.exports = (app) => {


  // ========== All GET Requests ============= //
  app.get('/', (req, res) => {
    if (req.cookies.userLogin) {
      Categories.find({}, (err, categories) => {
        if (err) {
          res.send(err);
        }
        res.render('pages/home', { 
          title: 'Home',
          categories: categories
        });
      });
    } else {
      res.redirect('/login');
    }
  }); 

  app.get('/home', (req, res) => {
    if (req.cookies.userLogin) {
      Categories.find({}, (err, categories) => {
        if (err) {
          res.send(err);
        }
        res.render('pages/home', {
          title: 'Home',
          categories: categories
        });
      });
    } else {
      res.render('auth/login', { title: 'Login' });
    }
  }); 

  app.get('/about', (req, res) => {
    if (req.cookies.userLogin) {
      res.render('pages/about', { title: 'About' });
    } else {
      res.redirect('/login');
    }
  }); 

  app.get('/contact', (req, res) => {
    if (req.cookies.userLogin) {
      res.render('pages/contact', { title: 'Contact' });
    } else {
      res.redirect('/login');
    }
  }); 

  app.get('/blog-detail', (req, res) => {
    if (req.cookies.userLogin) {
      res.render('pages/blog-detail', { title: 'Blog Details' });
    } else {
      res.redirect('/login');
    }
  });

  // // ========== All POST Requests ============= //

  app.post('/contact', (req, res) => {
    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("email", "Enter a valid email address.").isEmail();
    const errors = req.validationErrors();
    if (errors) {
      res.render('pages/contact', {
        title: 'Contact',
        errors: errors
      });
      return;
    } else {
      sendMail(req.body);
    }
    res.render('pages/contact', {
      title: 'Contact',
      mailSentMessage: true
    });
  });

  app.post('/category', (req, res) => {
    req.checkBody("name", "Name is required").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      res.send(errors);
    } else {
      Categories.findOne({ 'name': req.body.name}, (err, category) => {
        if (err) {
          console.log(err);
        }
        if (category) {
          console.log('this category already exists');
          res.send('this category already exists');
        } else {
          let category = new Categories(req.body);
          category.save((err, success) => {
            if (err) {
              console.log('err',err);
              res.send(err);
            }
            // console.log('success');
            console.log("success ", success);
            res.send(success);
          });
        }
      });
    }
  });
  

}