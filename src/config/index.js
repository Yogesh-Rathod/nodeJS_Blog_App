let credentials = require('./credentials');

let databaseString = "mongodb://localhost/blogsdb";

if (process.env.NODE_ENV) {
  databaseString = "mongodb://" + credentials.username + ":" + credentials.password + "@ds149974.mlab.com:49974/excel-json";
}

module.exports = {
  dbConnection: () => {
    return databaseString;
  },
  jwtSecret: '12345'
};