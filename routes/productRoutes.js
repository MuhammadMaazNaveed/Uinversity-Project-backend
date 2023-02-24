const express = require("express");
const routerProduct = express.Router();
const Product = require("../controllers/Product.js");

routerProduct.post("/addProduct", Product.CreateProduct);
routerProduct.get("/allProduct", Product.getProducts);
routerProduct.get("/:id", Product.getProduct);
routerProduct.post("/:id", Product.editProduct);
routerProduct.delete("/:id", Product.deleteProduct);

module.exports = routerProduct;
