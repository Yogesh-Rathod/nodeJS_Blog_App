// ========== Global Dependencies ============ // 
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const cors = require('cors');
const morgan = require('morgan'); 
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');

// ========== Local Dependencies ============= //
const config = require('./src/config');

// ========== Config Options For Middlewares ============= //

const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,
  optionsSuccessStatus: 200
};

// ========== Setting Up PORT ============= //
const PORT = process.env.PORT || 3000;

// ========== Setting Up Middlewares ============= //
app.use(cors(corsOptions));
app.use('/public', express.static(path.join(__dirname, 'public')) );

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

// ========== Connect To MongoDB through Mongoose ============= //
mongoose.connect(config.dbConnection(), { useMongoClient: true } );

// MONGOOSE CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open to ' + config.dbConnection());
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose connection disconnected through app termination');
    process.exit(0);
  });
});


// ========== Setting View Engine ============= //
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'pug');

// ========== Home Page Routing ============= //
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey' })
});

// ========== Listen to Requests ============= //
app.listen(PORT, () => {
  console.log("App is running at PORT ", PORT);
});
