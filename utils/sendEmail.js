const nodemailer = require('nodemailer')

exports.sendEmail = async (email, subject, message) => {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.PASSWORD
        }
    });
      
    var mailOptions = {
        from: process.env.EMAILID,
        to: email,
        subject: subject,
        html: message
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}
