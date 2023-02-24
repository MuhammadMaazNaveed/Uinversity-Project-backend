const employee = require("../models/employeesSchema.js");

const CreateEmployee = async (req, res) => {
  const { name, gender, email, age } = req.body;
  const newEmployee = new employee({
    name,
    gender,
    email,
    age,
  });
  try {
    await newEmployee.save();
    if (newEmployee)
      return res.status(201).json({ success: true, newEmployee });
  } catch (error) {
    console.log(error);
  }
};
const getEmployees = async (req, res) => {
  try {
    const Employees = await employee.find({});
    res.status(200).json(Employees);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const getEmployee = async (req, res) => {
  try {
    const Employee = await employee.findById(req.params.id);
    res.status(200).json(Employee);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const editEmployee = async (req, res) => {
  let Employee = req.body;
  const neweditEmployee = new employee(Employee);
  try {
    await employee.updateOne({ _id: req.params.id }, neweditEmployee);
    res.status(201).json(neweditEmployee);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
const deleteEmployee = async (req, res) => {
  try {
    await employee.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

module.exports = {
  CreateEmployee,
  getEmployees,
  getEmployee,
  editEmployee,
  deleteEmployee,
};
