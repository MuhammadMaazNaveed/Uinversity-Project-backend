const category = require("../models/categorySchema.js");

const CreateCategory = async (req, res) => {
  const { category } = req.body;
  try {
    const categoryExist = await category.findOne({ category });
    if (!categoryExist) {
      return res.status(400).json({
        errorMessage: `${category} already exists`,
      });
    }
    let newCategory = new category();
    newCategory.category = category;
    newCategory = await newCategory.save();
    res.status(200).json({
      successMessage: `${newCategory.category} was created`,
    });
  } catch (error) {
    console.log("category create error", err);
    res.status(500).json({
      successMessage: "please try again later",
    });
  }
};
const getCategorys = async (req, res) => {
  try {
    const Categories = await category.find({});
    res.status(200).json(Categories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const getCategory = async (req, res) => {
  try {
    const Employee = await category.findById(req.params.id);
    res.status(200).json(Employee);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const editCategory = async (req, res) => {
  let Employee = req.body;
  const neweditEmployee = new category(Employee);
  try {
    await employee.updateOne({ _id: req.params.id }, neweditEmployee);
    res.status(201).json(neweditEmployee);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
const deleteCategory = async (req, res) => {
  try {
    await category.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

module.exports = {
  CreateCategory,
  getCategorys,
  getCategory,
  editCategory,
  deleteCategory,
};
