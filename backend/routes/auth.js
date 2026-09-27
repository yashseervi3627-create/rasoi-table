const express = require("express");
const db = require("../config/db");

const router = express.Router();

// Register a new customer or chef
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      specialty,
      experience,
      location,
      bio,
    } = req.body;

    // Check required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required",
      });
    }

    // Check if email already exists
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Insert user
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, password, role]
    );

    const userId = result.insertId;

    // If the user is a chef, create their chef profile
    if (role === "chef") {
      await db.query(
        `INSERT INTO chef_profiles
        (user_id, kitchen_name, description, location)
        VALUES (?, ?, ?, ?)`,
        [
          userId,
          specialty || null,
          bio || null,
          location || null,
        ]
      );
    }

    res.status(201).json({
      success: true,
      message: "Registration successful",
      userId,
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
});

// Login customer or chef
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const [users] = await db.query(
      "SELECT id, name, email, password, role FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    // Check password
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

module.exports = router;