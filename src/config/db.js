const mongoose = require("mongoose");

// MongoDB connection setup
const mongoDBConnection = async () => {
  const DB = await mongoose.connect(
    "mongodb://localhost:27017/product_transactions",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log(
    `MongoDB Database Connection Successfully: ${DB.connection.host}`
  );
};

module.exports = mongoDBConnection;
