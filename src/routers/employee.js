const express = require("express");
const empRoutes = new express.Router();
const Employee = require("../models/Employee");
const EmployeeDetail = require("../models/EmployeeDetail");
const auth = require("../middleware/auth");
empRoutes.get("/", (req, res) => {
  res.send("Test , Hello world");
});
//user register
empRoutes.post("/add", auth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dob,
      birthPlace,
      joinDate,
      department,
      panCardNumber,
      gender,
      phoneNumber,
      email,
      salary,
      maritalStatus,
      country,
      state,
      district,
      zipcode,
    } = req.body.data;
    const empDetail = await new EmployeeDetail({
      department,
      phone: phoneNumber,
      salary: salary,
      country,
      state,
      district,
      zip_code: zipcode,
    }).save();
    const emp = await new Employee({
      firstName,
      lastName,
      email,
      dob,
      phone: phoneNumber,
      birth_place: birthPlace,
      join_date: joinDate,
      gender: gender,
      maritial_status: maritalStatus,
      pan_card_no: panCardNumber,
      created_by: req.user._id,
      detail_ref: empDetail._id,
    }).save();

    res.status(201).send({ emp, empDetail });
  } catch (error) {
    console.log("Error ", error);
    res.status(400).send(error.message);
  }
});

empRoutes.get("/all", auth, async (req, res) => {
  try {
    const employees = await Employee.find({});
    if (employees == null) {
      return res
        .status(200)
        .send({ error: "No employees found ! please add " });
    }
    return res.status(200).send(employees);
  } catch (error) {
    res.status(500).send({ error });
  }
});
empRoutes.get("/additonal_data", auth, async (req, res) => {
  try {
    const _id = req.query["id"];

    const empDetails = await Employee.findOne({ _id }).populate("detail_ref");

    res.send(empDetails);
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error);
  }
});
// update employee
empRoutes.patch("/:id", auth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dob,
      birthPlace,
      joinDate,
      department,
      panCardNumber,
      gender,
      phoneNumber,
      email,
      salary,
      maritalStatus,
      country,
      state,
      district,
      zipcode,
    } = req.body.data;
    const _id = req.params.id;
    const empDetailID = await Employee.findOne({ _id }).populate("detail_ref")
      ._id;
    const updatedDetail = await EmployeeDetail.findByIdAndUpdate(empDetailID, {
      department,
      phone: phoneNumber,
      salary: salary,
      country,
      state,
      district,
      zip_code: zipcode,
    });
    const updatedEmp = await Employee.findByIdAndUpdate(_id, {
      firstName,
      lastName,
      email,
      dob,
      phone: phoneNumber,
      birth_place: birthPlace,
      join_date: joinDate,
      gender: gender,
      maritial_status: maritalStatus,
      pan_card_no: panCardNumber,
      created_by: req.user._id,
      detail_ref: empDetail._id,
    });
    console.log("updated", updatedEmp, updatedDetail);
  } catch (error) {}
});
empRoutes.delete("/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const deletedEmp = await Employee.deleteOne({ _id });

    res.status(202).send(deletedEmp);
  } catch (error) {
    res.status(500).send(error);
    console.log("error", error);
  }
});
module.exports = empRoutes;
