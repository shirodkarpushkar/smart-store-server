const api = require("./userController");
const express = require("express");
const router = express.Router();

router.post("/register", api.registration);

module.exports = router;
