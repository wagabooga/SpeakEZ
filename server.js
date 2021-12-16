const path = require('path')
const http = require('http')

const express = require('express');
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketio(server)

// set static folder
app.use(express.static(path.join(__dirname, 'public')))


// Run when client connects
io.on('connection', socket => {
  console.log('New socket connection...')

  // welcome message (single client)
  socket.emit('message', 'Welcome to SpeakEZ!')

  // broadcast when a user connects (all clients !currentUser)
  socket.broadcast.emit('message', 'A User has joined the chat');

  // runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat')
  })

})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {console.log(`Server up on port ${PORT}`)})
