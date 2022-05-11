const express = require('express')
require('./db/mongoose')
const authRouter = require('./routers/authRoutes')
const facultyRouter = require('./routers/facultyRoutes')
const studentRouter = require('./routers/studentRoutes')
const commonRouter = require('./routers/commonRoutes')
const internshipRouter = require('./routers/internshipRoutes')
const chatRouter = require('./routers/chatRoutes')

const app = express()
const host = '0.0.0.0';
const port = process.env.PORT

app.use(express.json())
app.use(authRouter)
app.use(facultyRouter)
app.use(studentRouter)
app.use(commonRouter)
app.use(internshipRouter)
app.use(chatRouter)

app.listen(port,host, () => {
    console.log('Server is up on port ' + port)
})