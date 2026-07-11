const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  generateTripPlan,
} = require("../controllers/aiController");

router.post(
  "/generate",
  verifyToken,
  generateTripPlan
);

module.exports = router;