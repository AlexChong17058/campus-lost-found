const express = require("express");
const router = express.Router();

const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  updateStatus,
  deleteItem,
  getItemStats
} = require("../controllers/itemController");

const protect = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");

const { body } = require("express-validator");
const { handleValidation } = require("../middleware/validation");


// ============================
// NEW: ITEM STATISTICS ROUTE
// ============================

router.get("/stats", getItemStats);


// ============================
// GET ALL ITEMS
// ============================

router.get("/", optionalAuth, getItems);


// ============================
// CREATE ITEM
// ============================

router.post(
  "/",
  protect,
  [
    body("title").trim().isLength({ min: 3 }).withMessage("Title too short"),
    body("description").trim().isLength({ min: 5 }).withMessage("Description too short"),
    body("category").isIn(["Lost", "Found"]).withMessage("Invalid category"),
    body("location").trim().isLength({ min: 2 }).withMessage("Location required"),
    body("date").isISO8601().withMessage("Invalid date"),
    body("contactInfo").trim().isLength({ min: 3 }).withMessage("Contact info required")
  ],
  handleValidation,
  createItem
);


// ============================
// GET ITEM BY ID
// ============================

router.get("/:id", getItemById);


// ============================
// UPDATE ITEM
// ============================

router.put("/:id", protect, updateItem);


// ============================
// UPDATE STATUS
// ============================

router.patch("/:id/status", protect, updateStatus);


// ============================
// DELETE ITEM
// ============================

router.delete("/:id", protect, deleteItem);


module.exports = router;