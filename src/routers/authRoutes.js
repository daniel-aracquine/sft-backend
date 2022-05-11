const express = require("express");
const mongoose = require('mongoose')
const router = new express.Router();
const Student = require('../models/student')
const Faculty = require('../models/faculty')
const User = require('../models/user')
const {auth, facultyAuth, studentAuth} = require('../middlewares/auth')

router.post("/users/signup/:is",async(req,res) => {
    if(req.params.is == 'faculty') {
        try {
            const {email, password, ...facultyObject} = req.body
            const faculty = new Faculty(facultyObject)
            const user = new User({
                email:req.body.email,
                password:req.body.password,
                faculty:faculty._id
            }) 
            await user.save()
            await faculty.save()
            const token = await user.generateAuthToken()
            res.status(200).send({
                faculty,
                token,
                email:req.body.email
            })
        } catch (e) {
            res.status(500).send(e)
        }
    } else {
        try {
            const {email, password, ...studentObject} = req.body
            const student = new Student(studentObject)
            const user = new User({
                email:req.body.email,
                password:req.body.password,
                student:student._id
            }) 
            await user.save()
            await student.save()
            const token = await user.generateAuthToken()
            res.status(200).send({
                student,
                token,
                email:req.body.email
            })
        } catch (e) {
            res.status(500).send(e)
        }
    }
})

router.post("/users/login",async(req,res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        )
        let token;
        let isFaculty;
        let person;
        if(user.faculty) {
            person = await Faculty.findById(user.faculty)
            token = await user.generateAuthToken()
            isFaculty = true
        } else {
            person = await Student.findById(user.student)
            token = await user.generateAuthToken()
            isFaculty = false
        }
        res.status(200).send({
            user:person,
            token,
            isFaculty,
            email:req.body.email
        })
    } catch (e) {
        res.status(e.message ? 401 : 500).send(e.message)
    }
})

router.post('/users/logout',auth,async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
          return token.token !== req.token;
        });
    
        await req.user.save();
        res.send();
      } catch (e) {
        res.status(500).send(e);
      }
})

router.post('/users/logoutAll',auth,async(req,res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
    
        res.send();
      } catch (e) {
        res.status(500).send();
      }
})

router.get("/users/profile", auth, async (req, res) => {
    try {
        const user = req.person
        res.status(200).send({
            user,
            email:req.user.email
        });
    } catch (e) {
        res.status(500).send(e)
    }
});

router.patch("/users/updateProfile",auth,async(req, res) => {
    const updates = Object.keys(req.body)
    let allowedUpdates;

    if(req.isFaculty) {
        allowedUpdates = ["name","siteLink","description","qualifications","contactNo","email"]
    } else {
        allowedUpdates = ["email","name","enrollment","branch","currentSem","yearOfGrad","contactNo","degree","institute","abilities"]
    }
    const isValid = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValid) {
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try {

        updates.forEach((update) => {
            if(update=='email') req.user[update] = req.body[update]
            else req.person[update] = req.body[update]
        })
        await req.user.save()
        await req.person.save()

        res.send({
            user:req.person,
            email:req.user.email
        })
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router