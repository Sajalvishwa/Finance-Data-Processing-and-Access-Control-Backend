const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Record = require("../models/record");
const {authorize} = require("../middlewares/auth");

/**
 * =========================
 * CREATE RECORD
 * Only Admin can create records
 * =========================
 */
router.post("/", authorize("admin"), async (req, res) => {
  try {
    const { amount, type, category } = req.body;

    // Validate required fields
    if (!amount || !type || !category) {
      return res.status(400).json({
        error: "Amount, type and category are required",
      });
    }

    const newRecord = await Record.create(req.body);

    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * =========================
 * GET RECORDS
 * Supports:
 * - Filtering (type, category, date range)
 * - Pagination
 * - Sorting (latest first)
 * Access: Admin + Analyst
 * =========================
 */
router.get("/", authorize("admin", "analyst"), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      type,
      category,
      startDate,
      endDate,
    } = req.query;

    let filter = {};

    // Filter by transaction type (income/expense)
    if (type) filter.type = type;

    // Filter by category
    if (category) filter.category = category;

    // Filter by date range
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Fetch records with pagination and sorting
    const records = await Record.find(filter)
      .sort({ date: -1 }) // latest records first
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    // Total records count (for frontend pagination)
    const total = await Record.countDocuments(filter);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: records,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * =========================
 * UPDATE RECORD
 * Only Admin can update records
 * =========================
 */
router.put("/:id", authorize("admin"), async (req, res) => {
  try {
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid record ID" });
    }

    const updatedRecord = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // If record not found
    if (!updatedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json({
      message: "Record updated successfully",
      data: updatedRecord,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * =========================
 * DELETE RECORD
 * Only Admin can delete records
 * =========================
 */
router.delete("/:id", authorize("admin"), async (req, res) => {
  try {
    const deletedRecord = await Record.findByIdAndDelete(req.params.id);

    // If record not found
    if (!deletedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json({
      message: "Record deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;