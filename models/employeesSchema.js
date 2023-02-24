const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const employeeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  email: {
    type: String,
    required: true,
  },
  age: { type: Number, min: 18, index: true },
});

const employee = mongoose.model("employee", employeeSchema);

module.exports = employee;
