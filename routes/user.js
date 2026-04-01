const express = require("express");
const router = express.Router();
const User = require("../models/user"); // capital

// CREATE USER
router.post("/", async (req, res) => {
  try {
    const newUser = await User.create(req.body); // variable alag naam
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;