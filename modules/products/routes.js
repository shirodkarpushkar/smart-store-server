import api from "@modules/products/controller";
import express from "express";
import { auth } from "@middlewares/index";

const router = express.Router();

router.get("/", auth.validateToken, api.getAllProducts);
router.get("/:id", auth.validateToken, api.getProductById);
router.get("/:id/reviews", auth.validateToken, api.getReviewsByProductId);
router.post("/:id/reviews", auth.validateToken, api.addProductReview);

module.exports = router;
