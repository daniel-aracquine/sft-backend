const express = require("express");
const mongoose = require('mongoose')
const router = new express.Router();
const Student = require('../models/student')
const Faculty = require('../models/faculty')
const Internship = require('../models/internship')
const User = require('../models/user')
const Chat = require('../models/chat')
const {auth, facultyAuth, studentAuth} = require('../middlewares/auth')

router.get("/chats/:id",auth,async(req,res)=>{
    try {
        const chat = await Chat.findById(req.params.id)
        res.status(200).send(chat)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.post("/chats/sendMessage/:id",auth,async(req,res)=>{
    try {
        const chat = await Chat.findById(req.params.id)
        chat.messages = chat.messages.concat({
            by:req.person.id,
            byName:req.person.name,
            isFaculty:req.isFaculty,
            message:req.body.message
        })
        await chat.save()
        res.status(200).send(chat)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router