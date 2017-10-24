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
    let user = req.body;
    Users.saveUser(user, (err, user) => {
      if (err) {
        console.log("err ", err);
        throw err;
      }
      res.render('auth/register', { title: 'Register' });
    });
    // console.log("req ", req.body);
    // Users.saveUser(req.body, (sucessfull) => {
    //   console.log("sucessfull "); 
    //   res.render('auth/register', { title: 'Register' });
    // });
  });

}