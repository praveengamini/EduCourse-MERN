const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const MAX_DEVICES = 3;

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    const newDevice = {
      browser: req.useragent.browser,
      os: req.useragent.os,
      time: new Date(),
      token: token
    };

    let removedDevice = null;
    let deviceRemovedMessage = "";

    if (checkUser.devices.length >= MAX_DEVICES) {
      removedDevice = checkUser.devices.shift(); 
      const deviceName = `${removedDevice.browser} on ${removedDevice.os}`;
      deviceRemovedMessage = ` Device "${deviceName}" was logged out due to device limit.`;
    }

    checkUser.devices.push(newDevice);
    await checkUser.save();

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully" + deviceRemovedMessage,
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
      ...(removedDevice && {
        deviceRemoved: {
          browser: removedDevice.browser,
          os: removedDevice.os,
          time: removedDevice.time,
          deviceName: `${removedDevice.browser} on ${removedDevice.os}`
        }
      })
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};
const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (token && req.user) {
      const result = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { devices: { token: token } } },
        { new: true } 
      );
      
      console.log('Device removal result:', result ? 'Success' : 'Failed');
      console.log('Remaining devices:', result?.devices?.length || 0);
    }

    res.clearCookie("token").json({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (e) {
    console.log('Logout error:', e);
    res.clearCookie("token").json({
      success: true,
      message: "Logged out successfully!",
    });
  }
};

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found!",
      });
    }

    const deviceExists = user.devices.some(device => device.token === token);
    if (!deviceExists) {
      return res.status(401).json({
        success: false,
        message: "Unauthorised user!",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };