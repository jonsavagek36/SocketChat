let express = require('express');
let path = require('path');
let app = express();
let chat = require('./chatapp');

app.use(express.static(path.join(__dirname, 'public')));

let port = process.env.PORT || 5000;
let http = require('http').createServer(app).listen(port);
let io = require('socket.io')(http);

io.sockets.on('connection', function(socket) {
  chat.initChat(io, socket);
});
