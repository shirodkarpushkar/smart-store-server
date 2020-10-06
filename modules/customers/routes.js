import api from "@modules/customers/controller";
import express from "express";
import { existingUser } from "@middlewares/index";
const router = express.Router();
router.post("/register", existingUser, api.registration);
router.post("/verifyemail", api.verifyEmail);

module.exports = router;
