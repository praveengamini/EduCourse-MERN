const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../../models/User'); 

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});


const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString('hex'); 
};

const addStudentByAdmin = async (req, res) => {
  try {
    const { userName, email, phone } = req.body;

    if (!userName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Username and email are required'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const randomPassword = generateRandomPassword();
    
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

    const newUser = new User({
      userName,
      email,
      phone: phone || '',
      password: hashedPassword,
      role: 'student',
      createdByAdmin: true,
      createdAt: new Date()
    });

    await newUser.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Account Credentials - Welcome!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Our Platform!</h2>
          <p>Dear ${userName},</p>
          <p>Your account has been created successfully. Here are your login credentials:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> 
              <span id="password" style="background-color: #fff; padding: 5px; border: 1px solid #ddd; font-family: monospace; user-select: all;">${randomPassword}</span>
              <button onclick="copyPassword()" style="margin-left: 10px; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">Copy</button>
            </p>
          </div>
          
          <script>
            function copyPassword() {
              const passwordText = document.getElementById('password').textContent;
              navigator.clipboard.writeText(passwordText).then(() => {
                const button = event.target;
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.style.backgroundColor = '#28a745';
                setTimeout(() => {
                  button.textContent = originalText;
                  button.style.backgroundColor = '#007bff';
                }, 2000);
              }).catch(err => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = passwordText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                const button = event.target;
                button.textContent = 'Copied!';
                button.style.backgroundColor = '#28a745';
                setTimeout(() => {
                  button.textContent = 'Copy';
                  button.style.backgroundColor = '#007bff';
                }, 2000);
              });
            }
          </script>
          
          <p style="color: #e74c3c;"><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
          
          <p>You can now log in to your account using these credentials.</p>
          
          <p>Best regards,<br>The Admin Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: 'Student account created successfully and credentials sent via email',
      data: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        createdAt: newUser.createdAt
      },
      generatedPassword: randomPassword,
      note: 'Password has been sent to student via email'
    });

  } catch (error) {
    console.error('Error adding student:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    if (error.message.includes('nodemailer')) {
      return res.status(500).json({
        success: false,
        message: 'User created but failed to send email. Please contact admin.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
const changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      createdByAdmin: false
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};



module.exports = {
  addStudentByAdmin,
  changePassword,
};