const express = require("express");
const router = express.Router();
const employee = require("../controllers/employee.js");

router.post("/createEmployee", employee.CreateEmployee);
router.get("/allEmployee", employee.getEmployees);
router.get("/:id", employee.getEmployee);
router.post("/:id", employee.editEmployee);
router.delete("/:id", employee.deleteEmployee);

module.exports = router;
