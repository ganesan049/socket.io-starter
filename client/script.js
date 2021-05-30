import { io } from "socket.io-client";

const joinRoomBtn = document.getElementById('join-button')
const messageIp = document.getElementById('message-input')
const roomIp = document.getElementById('room-input')
const form = document.getElementById('form')

const socket = io('http://localhost:3000');
const userSocket = io('http://localhost:3000/user',{auth:{token:'Test'}});
userSocket.on('connect_error',errMessage => {
    displayMessage(errMessage)
})
socket.on('connect',() => {
    displayMessage(`yours id: ${socket.id}`)
});
socket.on('receive-message',message => {
    displayMessage(message);
});

form.addEventListener('submit',e => {
    e.preventDefault();
    
    const message = messageIp.value;
    const room = roomIp.value;
    
    if(message == '')return;
    socket.emit('send-message',message,room);
    displayMessage(message);
    
    messageIp.value = '';
});

joinRoomBtn.addEventListener('click', () => {
    const room = roomIp.value;
    socket.emit('join-room',room,message => {
        displayMessage(message)
    });
})

function displayMessage(message){
    const div = document.createElement('div');
    div.textContent = message;
    document.getElementById('message-container').appendChild(div);
}

let count = 0;
setInterval(() => {
    socket.volatile.emit('ping',++count)
}, 1000);

document.addEventListener('keydown', e=>{
    if(e.target.matches('input')) return;
    if(e.key == 'c') socket.connect()
    if(e.key == 'd') socket.disconnect()
})