const express = require("express");
const router = express.Router();

const Record = require("../models/record");
const { authenticate, authorize } = require("../middlewares/auth");

/**
 * =========================
 * GET ALL RECORDS (FILTER + OPTIONAL)
 * Access: Admin, Analyst
 * =========================
 */
router.get("/", authorize("admin", "analyst"), async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    let filter = {};

    // Filter by type (income/expense)
    if (type) filter.type = type;

    // Filter by category
    if (category) filter.category = category;

    // Date range filter
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const records = await Record.find(filter);

    res.json({
      success: true,
      data: records,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * =========================
 * TOTAL INCOME
 * =========================
 */
router.get("/income", authorize("admin", "analyst"), async (req, res) => {
  try {
    const result = await Record.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      totalIncome: result[0]?.total || 0,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * =========================
 * TOTAL EXPENSE
 * =========================
 */
router.get("/expense", authorize("admin", "analyst"), async (req, res) => {
  try {
    const result = await Record.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      totalExpense: result[0]?.total || 0,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * =========================
 * NET BALANCE
 * =========================
 */
router.get("/balance", authorize("admin", "analyst"), async (req, res) => {
  try {
    const income = await Record.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const expense = await Record.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalIncome = income[0]?.total || 0;
    const totalExpense = expense[0]?.total || 0;

    res.json({
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * =========================
 * CATEGORY WISE TOTALS
 * =========================
 */
router.get("/category", authorize("admin", "analyst"), async (req, res) => {
  try {
    const result = await Record.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * =========================
 * MONTHLY TRENDS
 * NOTE: includes year + month for accuracy
 * =========================
 */
router.get("/monthly", authorize("admin", "analyst"), async (req, res) => {
  try {
    const result = await Record.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * =========================
 * WEEKLY TRENDS
 * =========================
 */
router.get("/weekly", authorize("admin", "analyst"), async (req, res) => {
  try {
    const result = await Record.aggregate([
      {
        $group: {
          _id: { $week: "$date" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * =========================
 * RECENT ACTIVITY
 * Last 5 records
 * =========================
 */
router.get("/recent", authorize("admin", "analyst"), async (req, res) => {
  try {
    const records = await Record.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      data: records,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;