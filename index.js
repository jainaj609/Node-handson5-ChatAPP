const express = require('express');
const http = require('http');
const cors = require('cors')
const socketio = require('socket.io')

const app = express()

app.get('/', (req, res) => {
    res.send("It's working")
})
const server = http.createServer(app);
const io = socketio(server)

// const io = require('socket.io')({
//     cors: {
//         origin: '*'
//     }
// });

const users = [{}];
io.on('connection', (socket) => {
    console.log("user connected");

    socket.on('joined', ({ user, time }) => {
        users[socket.id] = user;
        console.log(`${user} has joined`);
        socket.emit('welcome', { user: 'Admin', message: `Welcome to the chat ${users[socket.id]}`, time })
        socket.broadcast.emit('userjoined', { user: 'Admin', message: `${user} has joined`, time })

    })
    socket.on('message', ({ message, id, time }) => {
        io.emit('sendMessage', { user: users[id], message, id, time })
    })

    socket.on('disconnect', () => {

        socket.broadcast.emit('leave', { user:'Admin', message: `user has left`})
        console.log("user left");
    })
})

server.listen(4000, () => {
    console.log("server is runnning on 4000")
})
