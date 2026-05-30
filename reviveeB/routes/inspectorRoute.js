const express = require("express");
const router = express.Router();
const inspectorController = require("../controller/inspectorController");

router.post("/signup", inspectorController.signup);
router.post("/login", inspectorController.login);

module.exports = router;
