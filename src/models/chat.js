const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const chatSchema = new mongoose.Schema(
  {
    chatName:{
        type:String
    },
    faculty:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Faculty'
        },
        name:{
            type:String
        }
    },
    internship:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Internship'
    },
    students:[
        {
            
                id:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Student'
                },
                name:{
                    type:String
                }
            
        }
    ],
    messages:[
        {
            
                by:{
                    type:mongoose.Schema.Types.ObjectId,
                },
                isFaculty:{
                    type:Boolean,
                },
                byName:{
                    type:String
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
