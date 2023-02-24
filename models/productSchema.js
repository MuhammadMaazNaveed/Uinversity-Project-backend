const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const productSchema = mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  items: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});
// productSchema.index({ name });
const product = mongoose.model("product", productSchema);

module.exports = product;
