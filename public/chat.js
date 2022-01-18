const socket = io()
const messageContainer = document.getElementById('message-container')
const sendMessageForm = document.getElementById('send-message-form')
const messageValue = document.getElementById('message-value')

const name = prompt('Enter your name:')
appendMessage(`Welcome to the chat room ${name} :)`)
// sends data from client to server, name is needed IDE broken
socket.emit('new-user', name)

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-joined', name => {
  appendMessage(`${name} joined`)
})

socket.on('user-left', name => {
  appendMessage(`${name} left`)
})

sendMessageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageValue.value
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', message)
  messageValue.value = ''
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

