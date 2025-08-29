const { hash, compare } = require ("bcryptjs");
const jwt = require ("jsonwebtoken");
const User = require ("../../models/User.js");

const { sign, verify } = jwt;
const MAX_DEVICES = 3;

// REGISTER
const registerUser = async (req, res) => {
  const { userName, email, password, phone } = req.body; // include phone

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: "User already exists with the same email! Please try again.",
      });
    }

    const hashPassword = await hash(password, parseInt(process.env.SALT_ROUNDS));
    const newUser = new User({ userName, email, phone, password: hashPassword }); // add phone here

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        phone: newUser.phone,   // return phone
        role: newUser.role,
        createdAt: newUser.createdAt
      },
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occurred during registration",
    });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User doesn't exist! Please register first.",
      });
    }

    const checkPasswordMatch = await compare(password, checkUser.password);
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password! Please try again.",
      });
    }
    
    const token = sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
        phone: checkUser.phone,     // add phone to JWT payload
        createdAt: checkUser.createdAt,
        createdByAdmin:checkUser.createdByAdmin
      },
      process.env.JWT_SECRET, // Ideally from process.env.JWT_SECRET
      { expiresIn: "60m" }
    );

    const newDevice = {
      browser: req.useragent?.browser || "Unknown",
      os: req.useragent?.os || "Unknown",
      time: new Date(),
      token: token,
    };

    let removedDevice = null;
    let deviceRemovedMessage = "";

    if (checkUser.devices.length >= MAX_DEVICES) {
      checkUser.devices.sort((a, b) => new Date(a.time) - new Date(b.time));
      removedDevice = checkUser.devices.shift();
      const deviceName = `${removedDevice.browser} on ${removedDevice.os}`;
      deviceRemovedMessage = ` Device "${deviceName}" was logged out due to device limit.`;
    }

    checkUser.devices.push(newDevice);
    await checkUser.save();

    res
      .cookie("token", token, { httpOnly: true, secure: false })
      .json({
        success: true,
        message: "Logged in successfully." + deviceRemovedMessage,
        user: {
          email: checkUser.email,
          role: checkUser.role,
          id: checkUser._id,
          userName: checkUser.userName,
          phone: checkUser.phone, 
          createdAt : checkUser.createdAt,
         createdByAdmin:checkUser.createdByAdmin
        },
        ...(removedDevice && {
          deviceRemoved: {
            browser: removedDevice.browser,
            os: removedDevice.os,
            time: removedDevice.time,
            deviceName: `${removedDevice.browser} on ${removedDevice.os}`,
          },
        }),
      });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occurred during login",
    });
  }
};

// LOGOUT
const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (token && req.user) {
      const result = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { devices: { token } } },
        { new: true }
      );

      // console.log("Device removal result:", result ? "Success" : "Failed");
      // console.log("Remaining devices:", result?.devices?.length || 0);
    }

    res.clearCookie("token").json({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (e) {
    // console.error("Logout error:", e);
    res.clearCookie("token").json({
      success: true,
      message: "Logged out with error fallback",
    });
  }
};

// AUTH MIDDLEWARE
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found!",
      });
    }

    const deviceExists = user.devices.some((device) => device.token === token);
    if (!deviceExists) {
      return res.status(401).json({
        success: false,
        message: "Unauthorised user!",
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    // console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

// ✅ Named exports for ESM
module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
