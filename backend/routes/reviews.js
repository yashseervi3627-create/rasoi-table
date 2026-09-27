const express = require("express");
const db = require("../config/db");

const router = express.Router();

// Add a new review
router.post("/", async (req, res) => {
  try {
    const {
      customer_id,
      food_id,
      rating,
      comment,
    } = req.body;

    if (
      !customer_id ||
      !food_id ||
      !rating
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Customer ID, food ID and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 1 and 5",
      });
    }

    await db.query(
      `INSERT INTO reviews
      (customer_id, food_id, rating, comment)
      VALUES (?, ?, ?, ?)`,
      [
        customer_id,
        food_id,
        rating,
        comment || null,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
    });
  } catch (error) {
    console.error(
      "Add review error:",
      error.message,
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while submitting review",
    });
  }
});

// Get reviews for a food item
router.get("/food/:foodId", async (req, res) => {
  try {
    const foodId = Number(req.params.foodId);

    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: "Invalid food ID",
      });
    }

    const [reviews] = await db.query(
      `
      SELECT
        r.id,
        r.customer_id,
        u.name AS customer_name,
        r.food_id,
        r.rating,
        r.comment,
        r.created_at
      FROM reviews r
      JOIN users u
        ON r.customer_id = u.id
      WHERE r.food_id = ?
      ORDER BY r.created_at DESC
      `,
      [foodId],
    );

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error(
      "Get reviews error:",
      error.message,
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while loading reviews",
    });
  }
});

module.exports = router;