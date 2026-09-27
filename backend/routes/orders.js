const express = require("express");
const db = require("../config/db");

const router = express.Router();

const VALID_STATUSES = [
  "Placed",
  "Accepted",
  "Preparing",
  "Ready",
  "Completed",
  "Cancelled",
];

// Create a new customer order
router.post("/", async (req, res) => {
  const connection = await db.getConnection();

  try {
    const {
      customer_id,
      total_amount,
      delivery_address,
      items,
    } = req.body;

    if (
      !customer_id ||
      !total_amount ||
      !delivery_address ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Customer, total, address and order items are required",
      });
    }

    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `INSERT INTO orders
      (customer_id, total_amount, status, delivery_address)
      VALUES (?, ?, 'Placed', ?)`,
      [
        customer_id,
        total_amount,
        delivery_address,
      ],
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items
        (order_id, food_id, quantity, price)
        VALUES (?, ?, ?, ?)`,
        [
          orderId,
          item.food_id,
          item.quantity,
          item.price,
        ],
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId,
    });
  } catch (error) {
    await connection.rollback();

    console.error(
      "Create order error:",
      error.message,
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while creating order",
    });
  } finally {
    connection.release();
  }
});

// Get all orders belonging to a chef
router.get("/chef/:chefId", async (req, res) => {
  try {
    const chefId = Number(req.params.chefId);

    if (!chefId) {
      return res.status(400).json({
        success: false,
        message: "Invalid chef ID",
      });
    }

    const [orders] = await db.query(
      `
      SELECT
        o.id AS order_id,
        o.customer_id,
        o.total_amount,
        o.status,
        o.delivery_address,
        o.created_at,
        u.name AS customer_name,
        oi.id AS item_id,
        oi.food_id,
        oi.quantity,
        oi.price AS item_price,
        f.name AS food_name,
        f.image_url
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN foods f ON oi.food_id = f.id
      WHERE f.chef_id = ?
      ORDER BY o.created_at DESC
      `,
      [chefId],
    );

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Get chef orders error:",
      error.message,
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while loading chef orders",
    });
  }
});

// Get all orders placed by a customer
router.get("/customer/:customerId", async (req, res) => {
  try {
    const customerId = Number(
      req.params.customerId,
    );

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
      });
    }

    const [orders] = await db.query(
      `
      SELECT
        o.id AS order_id,
        o.customer_id,
        o.total_amount,
        o.status,
        o.delivery_address,
        o.created_at,
        oi.id AS item_id,
        oi.food_id,
        oi.quantity,
        oi.price AS item_price,
        f.name AS food_name,
        f.image_url,
        f.chef_id
      FROM orders o
      JOIN order_items oi
        ON o.id = oi.order_id
      JOIN foods f
        ON oi.food_id = f.id
      WHERE o.customer_id = ?
      ORDER BY o.created_at DESC
      `,
      [customerId],
    );

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Get customer orders error:",
      error.message,
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while loading customer orders",
    });
  }
});

// Update order status
router.put("/:orderId/status", async (req, res) => {
  try {
    const orderId = Number(
      req.params.orderId,
    );

    const { status, chef_id } = req.body;

    if (!orderId || !chef_id || !status) {
      return res.status(400).json({
        success: false,
        message:
          "Order ID, chef ID and status are required",
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // Make sure this order actually contains
    // food belonging to this chef.
    const [chefOrders] = await db.query(
      `
      SELECT o.id
      FROM orders o
      JOIN order_items oi
        ON o.id = oi.order_id
      JOIN foods f
        ON oi.food_id = f.id
      WHERE o.id = ?
        AND f.chef_id = ?
      LIMIT 1
      `,
      [orderId, chef_id],
    );

    if (chefOrders.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found for this chef",
      });
    }

    await db.query(
      `UPDATE orders
       SET status = ?
       WHERE id = ?`,
      [status, orderId],
    );

    res.json({
      success: true,
      message: "Order status updated successfully",
      status,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error.message,
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while updating order status",
    });
  }
});

module.exports = router;