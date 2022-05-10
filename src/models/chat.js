const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const chatSchema = new mongoose.Schema(
  {
    faculty:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Faculty'
    },
    internship:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Internship'
    },
    students:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Student'
        }
    ],
    messages:[
        {
            by:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Student'
            },
            message:{
                type:String,
            }
        }
    ]
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
