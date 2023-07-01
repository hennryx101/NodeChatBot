const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector(".chat-messages");
const roomname = document.getElementById("room-name");
const userList = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

socket.emit('joinRoom', { username, room });


// get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputRoomUsers(users);
})

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;

    // msg = msg.trim();
  
    // if (!msg) {
    //   return false;
    // }

    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');

    // Check if the message is sent by the current user
    if (message.username === username) {
        div.classList.add('own-message');
    }
    
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);

    const pMsg = document.createElement('p');
    pMsg.classList.add('text');
    pMsg.innerText = message.text;
    div.appendChild(pMsg);
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room){
    roomname.innerText = room;
}
function outputRoomUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });