const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')

const socket = io();


// message from server
socket.on('message', message => {
  console.log(message)
  // this is where we would use react FE to "render" it
  outputMessage(message)

  // after every message we want to scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;


});


// message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  // emit message to server
  socket.emit('chatMessage', msg)
  
    // clear input after sending message
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus()
})

// output message to DOM

function outputMessage(message){
  const div = document.createElement('div')
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p> <p class="text"> ${message.text} </p>`
  document.querySelector('.chat-messages').appendChild(div)
}