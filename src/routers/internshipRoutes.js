const express = require("express");
const mongoose = require('mongoose')
const router = new express.Router();
const Student = require('../models/student')
const Faculty = require('../models/faculty')
const Internship = require('../models/internship')
const User = require('../models/user')
const {auth, facultyAuth, studentAuth} = require('../middlewares/auth')

router.get("/internships/getAll",auth,async(req,res)=> {
    try {
        const internships = await Internship.find({})
        let faculties = []
        for(const internship of internships) {
            const faculty = await Faculty.findById(internship.faculty)
            faculties.push(faculty.name)
        }
        res.status(200).send({
            internships,
            faculties
        })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get("/internships/:id",auth,async(req,res)=> {
    try {
        const internship = await Internship.findById(req.params.id)
        const faculty = await Faculty.findById(internship.faculty)
        res.status(200).send({
            internship,
            faculty
        })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch("/internships/edit/:id",auth,facultyAuth,async(req,res)=> {
    try {
        const internship = await Internship.findById(req.params.id)
        if(!(internship.faculty.equals(req.person.id))) {
            return res.status(400).send("Not your Internship")
        }

        const updates = Object.keys(req.body)
        const allowedUpdates = ["name", "startDate", "endDate", "isAvailable","course","stipend","mode","vacancies","expectations","requirements"]
        const isValid = updates.every((update) => {
            return allowedUpdates.includes(update)
        })

        if (!isValid) {
            return res.status(400).send({ error: 'Invalid updates' })
        }
        try {

            updates.forEach((update) => {
                internship[update] = req.body[update]
            })

            await internship.save()

            res.send(internship)
        } catch (e) {
            res.status(400).send(e)
        }
    } catch (e) {
        res.send(500).send(e)
    }
})

module.exports = router