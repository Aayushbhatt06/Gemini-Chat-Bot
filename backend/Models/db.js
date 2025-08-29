const mongoose = require('mongoose');
require("dotenv").config();

async function main() {
  try {
    await mongoose.connect(process.env.MONGOSTR);
    console.log("Connected to Mongo db");
  } catch (err) {
    console.error("Mongo connection error:", err);
  }
}

main();
