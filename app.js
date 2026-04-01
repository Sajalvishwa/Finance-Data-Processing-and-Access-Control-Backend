const express = require("express");
const app = express();
require("dotenv").config();

const connectDB = require("./config/db"); // 👈 IMPORTANT
connectDB();

app.use(express.json());

// routes
app.use("/auth", require("./routes/auth"));

const { authenticate } = require("./middlewares/auth");

// protected routes
app.use("/records", authenticate, require("./routes/record"));
app.use("/summary", authenticate, require("./routes/summary"));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});