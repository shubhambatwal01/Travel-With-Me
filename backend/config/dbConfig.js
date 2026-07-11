const mongoose = require("mongoose");
require("dotenv").config();

const ConnectDb = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("DATABASE CONNECTED");
};

module.exports = ConnectDb;
