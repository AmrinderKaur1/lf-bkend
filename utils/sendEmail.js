const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
  try {
      const transporter = nodemailer.createTransport({
          // host: process.env.HOST,
          service: 'gmail',
          port: 587,
          secure: false,
          ignoreTLS: true, // add this 
          auth: {
              user: 'anrinderk@gmail.com',
              pass: 'iyuhzpzdbiuflnzm', // app password
            //   pass: '()1234abcd',
          },
      });

      await transporter.sendMail({
          from: 'Lucky Fingers <noreply@luckyfingers.com>',
          to: 'amrinderkgglr@gmail.com',
          subject: subject,
          text: 'http://localhost:3000/forgot-password',
      });

      console.log("email sent sucessfully");
  } catch (error) {
      console.log(error, "email not sent");
  }
};

module.exports = sendEmail;


