const { port, databaseUrl } = require('./config');

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

//database connection
mongoose.connect(databaseUrl, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log(`Connected to Database on url: ${databaseUrl}`))

//chat app
const users = new Map()
//websocket chat connection
io.on('connection', socket => {
  socket.on('new-user', name => {
    users.set(socket.id, name)
    socket.broadcast.emit('user-joined', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users.get(socket.id)})
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-left', users.get(socket.id))
    delete users.delete(socket.id)
  })
})

//serve pages
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'taskmanager.html'));
});

app.get("/chat", (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'chat.html'));
});

app.get("/news", (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'news.html'));
});


server.listen(port, (error) => {
    console.log(`Server is running on ${port}`);
});