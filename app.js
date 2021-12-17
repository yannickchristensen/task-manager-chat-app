require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

//middleware setup
app.use(express.json())
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(cors())

//routers
const tasksRouter = require('./routes/tasks')
app.use('/tasks', tasksRouter)

//connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


//serve pages
app.get("/taskmanager", (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'taskmanager.html'));
});


const PORT = process.env.PORT || 8080;

server.listen(PORT, (error) => {
    console.log("Server is running on", PORT);
});