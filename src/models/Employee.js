const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const EmployeeDetail = require("./EmployeeDetail");

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.default.isEmail(value)) {
          throw new Error("enter a valid email");
        }
      },
    },
    // dob: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    dob: {
      type: Date,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    // birth_place: {
    //   type: String,

    //   trim: true,
    // },
    // join_date: {
    //   type: String,

    //   trim: true,
    // },

    gender: {
      type: String,
      required: true,
      trim: true,
    },
    // maritial_status: {
    //   type: String,

    //   trim: true,
    // },
    // pan_card_no: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    created_by: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    detail_ref: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "EmployeeDetail",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//remove unwanted information from user object
employeeSchema.methods.toJSON = function () {
  const emp = this;
  const empobj = emp.toObject();
  delete empobj.password;
  delete empobj.tokens;
  return empobj;
};
employeeSchema.pre("deleteOne", async function (next) {
  const empId = this.getQuery()["_id"];
  const empDetailRef = await Employee.findOne({ _id: empId }).populate(
    "detail_ref"
  );
  const resp = await EmployeeDetail.deleteOne({
    _id: empDetailRef.detail_ref._id,
  });

  next();
});
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
