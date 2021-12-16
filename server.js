const path = require('path')
const http = require('http')

const express = require('express');
const socketio = require('socket.io')
const formatMessage = require('./helpers/messages')
const {
  userJoin,
  getCurrentUser,
  userLeavesChat,
  getRoomUsers
} = require('./helpers/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server)

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'SpeakEZ Bot'
formatMessage(botName, 'Welcome to SpeakEZ!' )

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({username, room}) => {
    const user = userJoin(socket.id, username, room)

    socket.join(user.room)
    // welcome message (single client)
    socket.emit('message', formatMessage(botName, `Welcome ${username} to SpeakEZ!` ))
  
    // broadcast when a user connects (all clients !currentUser)
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${username} has joined the chat` ));

    // send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })
  })

  // runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeavesChat(socket.id);
    if(user) {
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat` ))
    }
    // send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })

  })

  // listen for incoming chat messages
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('message', formatMessage(user.username, msg))
  })
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {console.log(`Server up on port ${PORT}`)})
