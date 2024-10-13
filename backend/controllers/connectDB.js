const mongoose = require("mongoose");

const URL = process.env.DATABASE_URL;

function connectDB() {
  mongoose
    .connect(URL)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.log("Fail to connect DB", err);
    });
}

module.exports = { connectDB };
