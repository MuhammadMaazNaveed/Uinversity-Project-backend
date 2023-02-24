const product = require("../models/productSchema");

const CreateProduct = async (req, res) => {
  const { name, items, price } = req.body;
  const newProduct = new product({
    name,
    items,
    price,
  });
  try {
    await newProduct.save();
    if (newProduct) return res.status(201).json({ success: true, newProduct });
  } catch (error) {
    console.log(error);
  }
};
const getProducts = async (req, res) => {
  try {
    const Products = await product.find({});
    res.status(200).json(Products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const readProducts = async (req, res) => {
  try {
    const Products = await product.find({}).populate().limit(2);
    res.status(200).json(Products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const getProduct = async (req, res) => {
  try {
    const Product = await product.findById(req.params.id);
    res.status(200).json(Product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const editProduct = async (req, res) => {
  let Product = req.body;
  console.log(Product);
  const neweditProduct = new product(Product);
  try {
    await product.updateOne({ _id: req.params.id }, neweditProduct);
    res.status(201).json(neweditProduct);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    await product.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

module.exports = {
  CreateProduct,
  getProducts,
  getProduct,
  editProduct,
  deleteProduct,
};
