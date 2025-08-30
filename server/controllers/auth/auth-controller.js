const { hash, compare } = require ("bcryptjs");
const jwt = require ("jsonwebtoken");
const User = require ("../../models/User.js");

const { sign, verify } = jwt;
const MAX_DEVICES = 3;



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

const setNewPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // From auth middleware

  try {
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Check if new password is different from current password
    const isSamePassword = await compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Hash new password
    const hashedNewPassword = await hash(newPassword, parseInt(process.env.SALT_ROUNDS));

    // Update password and clear all devices (logout all sessions)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        password: hashedNewPassword,
        devices: [], // Clear all devices to logout from all sessions
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to update password",
      });
    }

    // Clear the current session cookie
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Password changed successfully. You have been logged out from all devices. Please login again.",
      loggedOut: true,
    });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while changing password",
    });
  }
};

// ✅ Named exports for ESM
module.exports = { registerUser, loginUser, logoutUser, authMiddleware,setNewPassword };
