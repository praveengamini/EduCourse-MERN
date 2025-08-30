const { hash, compare } = require("bcryptjs");
const User = require("../../models/User.js");

// CHANGE PASSWORD
const changePassword = async (req, res) => {
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

module.exports = { changePassword };