const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default:''
    },
    enrollment:{
        type:String,
        default:''
    },
    branch:{
        type:String,
        default:''
    },
    currentSem: {
        type:String,
        default:''
    },
    yearOfGrad:{
        type:String,
        default:''
    },
    contactNo:{
        type:String,
        default:''
    },
    degree:{
        type:String,
        default:''
    },
    institute:{
      type:String,
      default:''
    },
    abilities:[
      {
      ability:{
        type:String
      }}
    ],
    internships:[
      {
        id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'Internship'
        },
        status:{
          type:String,
          default:'P'
        }
      }
    ],
    resume:{
      type:String,
    },
  },
  {
    timestamps: true,
  }
);


const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
