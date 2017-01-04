let io;
let chatSocket;
let clients = [];

exports.initChat = function(sio, socket) {
  io = sio;
  chatSocket = socket;
  // User Events
  chatSocket.on('userSendsMsg', addMsg);
  chatSocket.on('setname', addName);
  chatSocket.on('sendDm', sendTargetDm);
  // Push data
  setTimeout(broadcastClients, 1000);
}

// User Functions

function addMsg(data) {
  io.emit('addMsg', { name: data.name, msg: data.msg });
}

function sendTargetDm(data) {
  let targetSock = clients.filter(client => {
    if (client.id == data.receiverId) {
      return client.sockid;
    }
  });
  let dm = {
    sender: data.sender,
    msg: data.dm
  };
  io.sockets.connected[targetSock].emit('getDm', dm);
}

// Host Functions

function addName(data) {
  let idx = data.id - 1;
  chatSocket['username'] = data.name;
  let user = {
    name: chatSocket['username'],
    sockid: chatSocket.id,
    id: idx
  };
  clients.push(user);
  io.emit('declareNewUser', user);
}

function broadcastClients() {
  clients.forEach((client) => {
    if (io.sockets.connected[client.sockid] == false) {
      clients.splice(client.id, 1);
    }
  });
  io.emit('refreshUsers', { users: clients });
  setTimeout(broadcastClients, 1000);
}
