const express = require("express");
const Router = express.Router;
const { registerUser, loginUser, logoutUser, authMiddleware,setNewPassword } = require("../../controllers/auth/auth-controller.js");

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.put('/set-password', authMiddleware, setNewPassword);

router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

module.exports = router;