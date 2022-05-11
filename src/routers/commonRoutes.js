const express = require("express");
const mongoose = require('mongoose')
const router = new express.Router();
const Student = require('../models/student')
const Faculty = require('../models/faculty')
const Internship = require('../models/internship')
const User = require('../models/user')
const {auth, facultyAuth, studentAuth} = require('../middlewares/auth')

router.get("/allFaculties",auth,async(req,res)=> {
    try {
        const faculties = await Faculty.find({});
        res.status(200).send(faculties)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get("/facultyProfile/:id",auth,async(req,res) => {
    try {
        const faculty = await Faculty.findById(req.params.id)
        res.status(200).send({
            faculty,
            email:req.user.email
        })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get("/studentProfile/:id",auth,async(req,res) => {
    try {
        const student = await Student.findById(req.params.id)
        res.status(200).send({
            student,
            email:req.user.email
        })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get("/faculties/allInternships/:id",auth,async(req,res)=> {
    try {
        const faculty = await Faculty.findById(req.params.id)
        let internships = []
        for(const a of faculty.internshipsOpened) {
            const b = await Internship.findById(a.id)
            internships.push(b)
        }
        res.status(200).send({
            internshipsOpened:faculty.internshipsOpened,
            internships
        })
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router