const mongoose = require("mongoose");
const { Schema } = mongoose;

/*
|--------------------------------------------------------------------------
| user Schema
|--------------------------------------------------------------------------
*/



const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["viewer", "analyst", "admin"],
    default: "viewer",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);