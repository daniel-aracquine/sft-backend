const express = require("express");
const mongoose = require('mongoose')
const router = new express.Router();
const Student = require('../models/student')
const Faculty = require('../models/faculty')
const Internship = require('../models/internship')
const User = require('../models/user')
const Chat = require('../models/chat')
const {auth, facultyAuth, studentAuth} = require('../middlewares/auth')

router.post("/students/apply",auth,studentAuth,async(req,res)=> {
    const _id = mongoose.Types.ObjectId(req.body.id)
    const user = req.person
    try {
        const internship = await Internship.findById(_id);
        if(internship.vacancies == 0) {res.status(200).send("No Seats Available");return;}
        
        let check = false

        for(const a of internship.students) {
            if(a.id.equals(req.person._id)) check=true
        }

        if(check) return res.status(200).send("Already Applied")

        internship.students = internship.students.concat({
            id:user._id
        })
        await internship.save()
        user.internships = user.internships.concat({
            id:internship._id
        })
        await user.save()

        res.status(200).send("Applied Successfully")
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get("/students/internships",auth,async(req,res)=>{
    try {
        let internships = []
        let faculties = []
        for(const internship of req.person.internships) {
            const a = await Internship.findById(internship.id)
            const b = await Faculty.findById(a.faculty)
            internships.push(a)
            faculties.push(b.name)
        }
        res.status(200).send({
            studentInternships:req.person.internships,
            internships,
            faculties
        })
    } catch (e) {
        res.status(500).send(e)
    }
})


router.get("/students/getChats",auth,studentAuth,async(req,res)=> {
    try {
        const chats = await Chat.find({
            "students.id":req.person._id,
            "students.name":req.person.name
            // {
            //     id:req.person._id,
            //     name:req.person.name
            // }
        })
        res.status(200).send(chats)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router