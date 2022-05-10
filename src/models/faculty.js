const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default:''
    },
    qualifications: [
        {
            qualification: {
                type: String,
            }
        }
    ],
    description:{
        type: String,
        default:''
    },
    siteLink:{
        type: String,
        default:''
    },
    contactNo:{
      type: String,
      default:''
    },
    internshipsOpened:[
        {
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Internship'
            },
            status:{
                type:String,
                default:'Available'
            }
        }
    ],
  },
  {
    timestamps: true,
  }
);


const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
