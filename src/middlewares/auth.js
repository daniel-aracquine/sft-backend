const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Faculty = require('../models/faculty')
const Student = require('../models/student')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','')

        if(!token) {
            throw new Error ;
        }
        
        const decoded = jwt.verify(token, process.env.secret_key)
        const user = await User.findOne({_id:decoded._id, 'tokens.token': token})

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user

        if(user.faculty) {
            req.isFaculty = true
            const person = await Faculty.findById(user.faculty)
            req.person = person
        } else {
            req.isFaculty = false
            const person = await Student.findById(user.student)
            req.person = person
        }
        next()
        
    } catch (e) {
        res.status(401).send(e.message)
    }
}

const facultyAuth = async (req, res, next) => {
    try {
        if(!req.isFaculty) {
            throw new Error
        }
        next()
    } catch (e) {
        res.status(401).send(e)
    }
}

const studentAuth = async (req, res, next) => {
    try {
        if(req.isFaculty) {
            throw new Error
        }
        next()
    } catch (e) {
        res.status(401).send(e)
    }
}

module.exports = {
    auth,
    facultyAuth,
    studentAuth
}