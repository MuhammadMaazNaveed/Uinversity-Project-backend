const product = require("../models/productSchema");

const searchByQuertType = async () => {
  const { type, query } = req.body;
  try {
    let products;
    switch (type) {
      case "text":
        products = await product.find({ $text: { $search: query } });
        break;
    }
    if (!products.length > 0) {
      products = await product.find({});
    }
    res.json({ products });
  } catch (error) {
    console.log(err, "filter Controller.getNew");
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};
