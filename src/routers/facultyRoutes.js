const express = require("express");
const mongoose = require('mongoose')
const router = new express.Router();
const Student = require('../models/student')
const Faculty = require('../models/faculty')
const Internship = require('../models/internship')
const User = require('../models/user')
const {auth, facultyAuth, studentAuth} = require('../middlewares/auth')

router.post("/faculty/addInternship",auth,facultyAuth,async(req,res)=>{
    const user = req.person
    try {
        const internship = new Internship(req.body)
        internship.faculty = user._id
        await internship.save()
        user.internshipsOpened = user.internshipsOpened.concat({
            id: internship._id
        })
        await user.save()

        res.status(200).send({
            internship,
            facultyName:user.name
        })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post("/faculty/action",auth,facultyAuth,async(req,res)=> {
    const stud_id = req.body.student
    const internship_id = req.body.internship
    try {
        const internship = await Internship.findById(internship_id)
        if(!(internship.faculty.equals(req.person._id))) {
            res.status(401).send("Not your Internship")
            return
        }
        
        const student = await Student.findById(stud_id)
        internship.students.forEach(student => {
            if(student.id == stud_id) {
                student.status = req.body.status
            }
        })

        if(internship.vacancies != 0) {
            internship.vacancies = internship.vacancies-1
        }

        await internship.save()
        student.internships.forEach(internship => {
            if(internship.id == internship_id) {
                internship.status = req.body.status
            }
        })

        await student.save()
        res.status(200).send("Done")
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get("/faculty/internships",auth,facultyAuth,async(req,res)=> {
    try {
        let internships = [];
        for(const internship of req.person.internshipsOpened) {
            const a = await Internship.findById(internship.id);
            internships.push(a)
        }
        res.status(200).send(internships)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get("/faculty/internship/:id",auth,facultyAuth,async(req,res) => {
    try {
        const internship = await Internship.findById(req.params.id)
        if(!(req.person._id.equals(internship.faculty))) {
            return res.status(400).send("Not Your Internship")
        }
        let profiles = []
        for(const student of internship.students) {
            const a = await Student.findById(student.id)
            profiles.push(a)
        }
        res.status(200).send({
            students:internship.students,
            profiles
        })
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router