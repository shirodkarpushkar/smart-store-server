import api from "@modules/customers/controller";
import express from "express";

const router = express.Router();
router.post("/register", api.registration);

module.exports = router;
