const api = require("./controller");
const express = require("express");
const router = express.Router();

router.post("/register", api.registration);

module.exports = router;
