// ========== Global Dependencies ============ // 
const _ = require('lodash');

// ========== Local Imports ============= //

const Users = require('../models/Users');

// ========== Routing ============= //

module.exports = function (app) {

  // ========== All GET Requests ============= //
  app.get('/', function (req, res) {
    res.render('auth/login', { title: 'Login' });
  });

  app.get('/login', function (req, res) {
    res.render('auth/login', { title: 'Login' });
  });

  app.get('/register', function (req, res) {

    res.render('auth/register', { title: 'Register' });
  });


  // ========== All POST Requests ============= //
  app.post('/login', function (req, res) {
    console.log("req ", req.body);
    res.render('auth/login', { title: 'Login' });
  });

  app.post('/register', function (req, res) {
    // validate the inputs Express
    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("email", "Enter a valid email address.").isEmail();
    req.checkBody("username", "Username should be 5 characters long.").isLength({ min: 5 });
    req.checkBody("password", "Password should be 5 characters long.").isLength({ min: 5 });
    req.checkBody('confirm', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
      console.log("errors ", errors);
      res.render('auth/register', { 
        title: 'Register',
        errors: errors
      });
      return;
    } else {
      let user = req.body;
      // Save User
      Users.saveUser(user, (err, user) => {
        if (err) {
          // Schema Validation Errors
          if(err.errors) {
            const errors = [];
            _.forEach(err.errors, (errorFields) => {
              errors.push(errorFields.message);
              console.log("errorFields ValidatorError", errorFields.message);
            });
            res.render('auth/register', {
              title: 'Register',
              errors: errors
            });
            return;
          }
        }
        res.render('auth/register', { title: 'Register' });
      });
    }

  });

}