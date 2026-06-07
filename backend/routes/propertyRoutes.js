import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getProperties,
  getFeaturedProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
} from "../controllers/propertyController.js";

const router = express.Router();

// Public routes
router.get("/", getProperties);
router.get("/featured", getFeaturedProperties);
router.get("/:id", getProperty);

// Protected routes
router.post("/", protect, createProperty);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);
router.get("/user/my-properties", protect, getMyProperties);

export default router;
