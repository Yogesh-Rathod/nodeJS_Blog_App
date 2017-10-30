'use strict';
// ========== Global Dependencies ============ // 
const nodemailer = require('nodemailer');

// ========== Local Imports ============= //

const config = require('../config/credentials')


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: config.emailUserName,
    pass: config.emailPassword
  }
});

module.exports = (userInfo) => {

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Yogesh Rathod 👻" <yr16666@gmail.com>',
    to: userInfo.email,
    subject: 'Thanx for Contacting Us',
    html: '<b>We will get in touch with you very soon!</b>'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('error error', error);
    }
    console.log('Email sent: %s', info.messageId);
  });

};