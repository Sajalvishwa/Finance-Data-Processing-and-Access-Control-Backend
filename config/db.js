const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // String ko quotes (" ") ke andar likhein
    await mongoose.connect("mongodb://127.0.0.1:27017/finace"); 

    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.log("Error Message:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;