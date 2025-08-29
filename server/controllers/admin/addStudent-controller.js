const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../../models/User'); 
const jwt = require('jsonwebtoken')
const transporter = nodemailer.createTransport({
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
    
    const hashedPassword = await bcrypt.hash(randomPassword, parseInt(process.env.SALT_ROUNDS));

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
              <span id="password" style="background-color: #fff; padding: 5px 10px; border: 1px solid #ddd; font-family: monospace; user-select: all; display: inline-block; border-radius: 3px;">${randomPassword}</span>
              <button onclick="copyPassword()" id="copyBtn" style="margin-left: 10px; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">Copy</button>
            </p>
          </div>
          
          <script>
            function copyPassword() {
              const passwordElement = document.getElementById('password');
              const passwordText = passwordElement.textContent || passwordElement.innerText;
              const button = document.getElementById('copyBtn');
              
              // Modern clipboard API
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(passwordText).then(() => {
                  showCopySuccess(button);
                }).catch(() => {
                  fallbackCopy(passwordText, button);
                });
              } else {
                fallbackCopy(passwordText, button);
              }
            }
            
            function fallbackCopy(text, button) {
              // Create a temporary textarea element
              const textArea = document.createElement('textarea');
              textArea.value = text;
              textArea.style.position = 'fixed';
              textArea.style.left = '-999999px';
              textArea.style.top = '-999999px';
              document.body.appendChild(textArea);
              
              // Select and copy the text
              textArea.focus();
              textArea.select();
              
              try {
                const successful = document.execCommand('copy');
                if (successful) {
                  showCopySuccess(button);
                } else {
                  showCopyError(button);
                }
              } catch (err) {
                showCopyError(button);
              }
              
              document.body.removeChild(textArea);
            }
            
            function showCopySuccess(button) {
              const originalText = button.textContent;
              const originalColor = button.style.backgroundColor;
              button.textContent = 'Copied!';
              button.style.backgroundColor = '#28a745';
              setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = originalColor || '#007bff';
              }, 2000);
            }
            
            function showCopyError(button) {
              const originalText = button.textContent;
              const originalColor = button.style.backgroundColor;
              button.textContent = 'Select & Copy';
              button.style.backgroundColor = '#ffc107';
              setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = originalColor || '#007bff';
              }, 3000);
            }
            
            // Alternative: Select text when clicked (fallback for email clients that don't support clipboard)
            document.getElementById('password').onclick = function() {
              if (window.getSelection) {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(this);
                selection.removeAllRanges();
                selection.addRange(range);
              } else if (document.selection) {
                const range = document.body.createTextRange();
                range.moveToElementText(this);
                range.select();
              }
            };
          </script>
          
          <p style="color: #e74c3c;"><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
          
          <p><strong>Note:</strong> If the copy button doesn't work, you can click on the password text to select it, then copy manually using Ctrl+C (or Cmd+C on Mac).</p>
          
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
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

    user.password = hashedPassword;
    if (Array.isArray(user.devices)) user.devices = [];
    user.createdByAdmin = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully. Please log in again.",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  addStudentByAdmin,
  changePassword,
};