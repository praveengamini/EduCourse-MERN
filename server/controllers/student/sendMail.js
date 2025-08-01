const nodemailer = require("nodemailer");

const sendEmail = async (req, res) => {
  
  const { name, email, contactNumber, courseName,userID,description } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
     tls: {
    rejectUnauthorized: false  
  }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: "New Form Submission",
    text: `From: ${name}\nEmail: ${email}\nUser ID : ${userID}\nContact Number: ${contactNumber}\nCourse Name: ${courseName}\ndescription :${description}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ messageSent: true });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ messageSent: false});
  }
};

module.exports = { sendEmail };
