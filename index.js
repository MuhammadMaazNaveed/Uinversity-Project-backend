const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./routes/index.js");
const routerProduct = require("./routes/productRoutes.js");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 8000;
app.use(express.json());

require("./db/index.js");
app.use(cors());
app.use(express.json()); // express.json()
app.use("/api/user", userRouter);
app.use("/api/user", routerProduct);
// app.use("/", filterRouter);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
