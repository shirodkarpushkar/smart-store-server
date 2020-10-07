import api from "@modules/products/controller";
import express from "express";
import { auth } from "@middlewares/index";

const router = express.Router();

router.get("/", auth.validateToken, api.getAllProducts);
router.get("/:id", auth.validateToken, api.getProductById);

module.exports = router;
