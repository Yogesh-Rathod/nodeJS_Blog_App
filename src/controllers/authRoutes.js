// ========== Global Dependencies ============ // 
const _ = require('lodash');
const bcrypt = require('bcrypt');

// ========== Local Imports ============= //

const Users = require('../models/Users');

// ========== Routing ============= //

module.exports = (app) => {

  // ========== All GET Requests ============= //

  app.get('/login', (req, res) => {
    if (req.cookies.userLogin) {
      res.redirect('/home');
    } else {
      res.render('auth/login', { title: 'Login' });
    }
  });

  app.get('/register', (req, res) => {
    res.render('auth/register', { title: 'Register' });
  });

  // ========== All POST Requests ============= //

  app.post('/sign-out', (req, res) => {
    res.clearCookie("userLogin");
    res.redirect('/login');
  });

  app.post('/login', (req, res) => {
    req.checkBody("email", "Enter a valid email address.").isEmail();
    req.checkBody("password", "Password should be 5 characters long.").isLength({ min: 5 });
    const errors = req.validationErrors();
    if (errors) {
      res.render('auth/login', {
        title: 'Login',
        errors: errors
      });
      return;
    } else {
      console.log("req BODY", req.body);
      // Users.findUser()
      Users.findOne({ 'email': req.body.email }, (err, person) => {
        if (err) {
          console.log(err);
        }
        if (!person) {
          const errors = ['User not found'];
          res.render('auth/login', {
            title: 'Login',
            errors: errors
          });
        } else {
          if (!bcrypt.compareSync(req.body.password, person.password)) {
            const errors = ['Password is wrong!'];
            res.render('auth/login', {
              title: 'Login',
              errors: errors
            });
          } else {
            const userInfo = {
              name: person.name,
              id: person._id
            };
            if (req.body.rememberMe) {
              res.cookie('userLogin', userInfo, { maxAge: 900000000000, httpOnly: true });
            } else {
              res.cookie('userLogin', userInfo, { maxAge: 9000000, httpOnly: true });
            }
            res.redirect('/');
          }
        }
      });
    }
  });

  app.post('/register', (req, res) => {
    // validate the inputs Express
    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("email", "Enter a valid email address.").isEmail();
    req.checkBody("username", "Username should be 5 characters long.").isLength({ min: 5 });
    req.checkBody("password", "Password should be 5 characters long.").isLength({ min: 5 });
    req.checkBody('confirm', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
      res.render('auth/register', {
        title: 'Register',
        errors: errors
      });
      return;
    } else {
      const user = new Users(req.body);
      const hash = bcrypt.hashSync(user.password, 10);
      user.password = hash;
      // Save User
      user.save((err, success) => {
        if (err) {
          // Schema Validation Errors
          if (err.errors) {
            const errors = [];
            _.forEach(err.errors, (errorFields) => {
              errors.push(errorFields.message);
            });
            res.render('auth/register', {
              title: 'Register',
              errors: errors
            });
            return;
          }
        }
        res.render('pages/home', { title: 'Home' });
      });
    }
  });

}