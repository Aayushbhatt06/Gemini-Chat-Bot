// // using Twilio SendGrid's v3 Node.js Library
// // https://github.com/sendgrid/sendgrid-nodejs javascript;
// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// // sgMail.setDataResidency('eu');
// // uncomment the above line if you are sending mail using a regional EU subuser
// const sendEmail = (otp) => {
//   const msg = {
//     to: "bhattaa@rknec.edu", // Change to your recipient
//     from: "aayushbhatt28306@gmail.com", // Change to your verified sender
//     subject: "OTP Verification",
//     text: "",
//     html: `<strong>${otp}</strong>`,
//   };
//   sgMail
//     .send(msg)
//     .then(() => {
//       console.log("Email sent");
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

// module.exports = sendEmail;
// sendEmail.js
// sendEmail.js
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (otp, recipient) => {
  const msg = {
    to: recipient,
    from: "aayushbhatt28306@gmail.com", // verified sender
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
    html: `<strong>${otp}</strong>`,
  };

  try {
    const response = await sgMail.send(msg);
    return { success: true, message: "Email sent", response };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send email",
      error: error.response ? error.response.body : error,
    };
  }
};

module.exports = sendEmail;

