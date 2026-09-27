const express = require("express");
const db = require("../config/db");

const router = express.Router();

// Add a new food item
router.post("/", async (req, res) => {
  try {
    const {
      chef_id,
      name,
      description,
      price,
      category,
      image_url,
    } = req.body;

    if (!chef_id || !name || !price) {
      return res.status(400).json({
        success: false,
        message:
          "Chef ID, food name and price are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO foods
      (chef_id, name, description, price, category, image_url)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        chef_id,
        name,
        description || null,
        price,
        category || null,
        image_url || null,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Food added successfully",
      foodId: result.insertId,
    });
  } catch (error) {
    console.error(
      "Add food error:",
      error.message,
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while adding food",
    });
  }
});

// Get all available foods for customers
router.get("/", async (req, res) => {
  try {
    const [foods] = await db.query(
      `SELECT
        f.id,
        f.chef_id,
        u.name AS chef_name,
        f.name,
        f.description,
        f.price,
        f.category,
        f.image_url,
        f.is_available,
        COALESCE(AVG(r.rating), 0) AS average_rating,
        COUNT(r.id) AS review_count
      FROM foods f
      JOIN users u
        ON f.chef_id = u.id
      LEFT JOIN reviews r
        ON f.id = r.food_id
      WHERE f.is_available = TRUE
      GROUP BY
        f.id,
        f.chef_id,
        u.name,
        f.name,
        f.description,
        f.price,
        f.category,
        f.image_url,
        f.is_available
      ORDER BY f.created_at DESC`,
    );

    res.json({
      success: true,
      foods,
    });
  } catch (error) {
    console.error(
      "Get foods error:",
      error.message,
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while loading foods",
    });
  }
});

// Get all foods belonging to a specific chef
router.get("/chef/:chefId", async (req, res) => {
  try {
    const chefId = Number(
      req.params.chefId,
    );

    if (!chefId) {
      return res.status(400).json({
        success: false,
        message: "Invalid chef ID",
      });
    }

    const [foods] = await db.query(
      `SELECT
        id,
        chef_id,
        name,
        description,
        price,
        category,
        image_url,
        is_available
      FROM foods
      WHERE chef_id = ?
      ORDER BY created_at DESC`,
      [chefId],
    );

    res.json({
      success: true,
      foods,
    });
  } catch (error) {
    console.error(
      "Get chef foods error:",
      error.message,
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while loading chef foods",
    });
  }
});

// Update a food item
router.put("/:foodId", async (req, res) => {
  try {
    const foodId = Number(
      req.params.foodId,
    );

    const {
      chef_id,
      name,
      description,
      price,
      category,
      image_url,
      is_available,
    } = req.body;

    if (
      !foodId ||
      !chef_id ||
      !name ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Food ID, chef ID, name and price are required",
      });
    }

    // Make sure this food belongs to this chef
    const [existingFoods] =
      await db.query(
        "SELECT id FROM foods WHERE id = ? AND chef_id = ?",
        [foodId, chef_id],
      );

    if (existingFoods.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Food not found for this chef",
      });
    }

    await db.query(
      `UPDATE foods
       SET name = ?,
           description = ?,
           price = ?,
           category = ?,
           image_url = ?,
           is_available = ?
       WHERE id = ? AND chef_id = ?`,
      [
        name,
        description || null,
        price,
        category || null,
        image_url || null,
        is_available !== false,
        foodId,
        chef_id,
      ],
    );

    res.json({
      success: true,
      message:
        "Food updated successfully",
    });
  } catch (error) {
    console.error(
      "Update food error:",
      error.message,
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while updating food",
    });
  }
});

// Delete a food item
router.delete("/:foodId", async (req, res) => {
  try {
    const foodId = Number(
      req.params.foodId,
    );

    const chefId = Number(
      req.query.chef_id,
    );

    if (!foodId || !chefId) {
      return res.status(400).json({
        success: false,
        message:
          "Food ID and chef ID are required",
      });
    }

    const [foods] = await db.query(
      "SELECT id FROM foods WHERE id = ? AND chef_id = ?",
      [foodId, chefId],
    );

    if (foods.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Food not found for this chef",
      });
    }

    await db.query(
      "DELETE FROM foods WHERE id = ? AND chef_id = ?",
      [foodId, chefId],
    );

    res.json({
      success: true,
      message:
        "Food deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete food error:",
      error.message,
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while deleting food",
    });
  }
});

module.exports = router;