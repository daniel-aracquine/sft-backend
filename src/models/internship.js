const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const internshipSchema = new mongoose.Schema(
  {
    name:{
        type:String,
        default:'N/A'
    },
    startDate:{
        type:Date,
        default: new Date()
    },
    endDate: {
        type:Date,
        default: new Date()
    },
    isAvailable:{
        type:Boolean,
        default:true
    },
    course:{
        type:String,
        default:''
    },
    stipend:{
        type:String,
        default:'Not Available'
    },
    mode:{
        type:String,
        default:'Hybrid'
    },
    vacancies:{
        type:Number,
        default:0
    },
    expectations:[
        {
            expectation:{
                type:String,
            }
        }
    ],
    requirements:{
        cg:{
            type:String,
            default:''
        },
        skills:[
            {
                skill:{
                    type:String
                }
            }
        ]
    },
    faculty:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Faculty'
    },
    students:[
        {
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Student'
            },
            status:{
                type:String,
                default:'P'
            }
        }
    ]
  },
  {
    timestamps: true,
  }
);

const Internship = mongoose.model("Internship", internshipSchema);

module.exports = Internship;
