const mongoose = require("mongoose");

const productTransactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  dateOfSale: Date,
  category: String,
  image: String,
  sold: String,
});

module.exports = mongoose.model("ProductTransaction", productTransactionSchema);
