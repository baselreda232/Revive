const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const { authenticate, adminOnly } = require("../middleware/auth");

router.post("/login", adminController.loginAdmin);
router.post("/logout", authenticate, adminOnly, adminController.logoutAdmin);

module.exports = router;