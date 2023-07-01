const express = require('express');
const http = require('http');
const path = require('path');
// const socketio = require('socket.io');
const { Server } = require('socket.io');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const formatMessage = require("./utils/messages");
const { getCurrentUser, userJoin, userLeave, getRoomUsers} = require("./utils/users");

app.use(express.static(path.join(__dirname, "Public")));

const bot = "ChatCord";
io.on('connection', socket => {
    socket.on("joinRoom", ({ username, room}) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room);

        socket.emit('message', formatMessage(bot, "Welcome to Chatcord"));
    
        socket.broadcast.to(user.room).emit("message",  formatMessage(bot, `${user.username} has joined the chat!`));
        // socket.to(user.room).emit("message",  formatMessage(bot, `${user.username} has joined the chat!`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
        
    });

    // Listen for chat message

    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',  formatMessage(user.username, msg));
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message',  formatMessage(bot, `${user.username} left the chat`));
        }
        
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});