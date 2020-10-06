import api from "@modules/customers/controller";
import express from "express";
import { existingUser, auth } from "@middlewares/index";


const router = express.Router();
router.post("/register", existingUser, api.registration);
router.post("/verifyemail", api.verifyEmail);
router.post("/signin", api.signIn);
router.patch("/changepassword", auth.validateToken, api.changePassword);

module.exports = router;
