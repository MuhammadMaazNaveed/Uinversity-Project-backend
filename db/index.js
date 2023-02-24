const mongoose = require("mongoose");
URI = process.env.MONGO_URL;
mongoose.set("strictQuery", false);
mongoose
  .connect(URI)
  .then(() => {
    console.log("Connection succesful");
  })
  .catch((e) => {
    console.log("no connection");
  });
