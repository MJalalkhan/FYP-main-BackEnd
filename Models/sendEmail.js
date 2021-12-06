import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'muhammad.bsse3549@iiu.edu.pk',
    pass: 'jalal3549'
  }
});

var sendEmail= (from, to, subject, text) => {
  transporter.sendMail({from, to, subject , text}, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 
}
export default sendEmail;
// module.exports = sendEmail;
// // const nodemailer = require("nodemailer");
// import nodemailer from "nodemailer";


// // const sendEmail = async (email, subject, text) => {
    
// //     var transporter = nodemailer.createTransport({
// //         service: 'gmail',
// //         auth: {
// //           user: 'youremail@gmail.com',
// //           pass: 'yourpassword'
// //         }
// //       });
      
// //       var mailOptions = {
// //         from: 'youremail@gmail.com',
// //         to: 'myfriend@yahoo.com',
// //         subject: 'Sending Email using Node.js',
// //         text: 'That was easy!'
// //       };
      
// //       transporter.sendMail(mailOptions, function(error, info){
// //         if (error) {
// //           console.log(error);
// //         } else {
// //           console.log('Email sent: ' + info.response);
// //         }
// //       });
// //     try {
// //         const transporter = nodemailer.createTransport({
// //             host: process.env.HOST,
// //             service: process.env.SERVICE,
// //             port: 587,
// //             secure: true,
// //             auth: {
// //                 user: process.env.USER,
// //                 pass: process.env.PASS,
// //             },
// //         });

// //         await transporter.sendMail({
// //             from: process.env.USER,
// //             to: email,
// //             subject: subject,
// //             text: text,
// //         });

// //         console.log("email sent sucessfully");
// //     } catch (error) {
// //         console.log(error, "email not sent");
// //     }
// // };
// // // export const productModel = mongoose.model("Product", product);

// export default sendEmail;