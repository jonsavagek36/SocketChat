

(function() {

  let IO = {

    init: function() {
      IO.socket = io.connect();
      IO.bindEvents();
    },

    bindEvents: function() {
      IO.socket.on('connected', IO.onConnected);
      IO.socket.on('refreshUsers', IO.refreshList);
      IO.socket.on('declareNewUser', IO.newUserJoins);
      IO.socket.on('addMsg', IO.postMsg);
      IO.socket.on('getDm', IO.receiveDm);
    },

    onConnected: function() {
      App.mySocketId = IO.socket.socket.sessionid;
      App.numUsers++;
    },

    refreshList: function(data) {
      App.userList.innerHTML = '';
      App.allUsers = [];
      data.users.forEach((user) => {
        App.users.push(user);
        let node = document.createElement('div');
        node.setAttribute('class', 'userName');
        node.setAttribute('id', user.id);
        let textnode = document.createTextNode(user.name);
        node.appendChild(textnode);
        // node.addEventListener('click', App.sendDm(user.id));
        App.userList.appendChild(node);

        // `<div class="userName" id="${user.id}">${user.name}</div>`
      });
    },

    newUserJoins: function(data) {
      App.messages.innerHTML += `${data.name} has joined the chat.<br />`;
    },

    postMsg: function(data) {
      App.messages.innerHTML += `${data.name}: ${data.msg}<br />`;
    },

    receiveDm: function(data) {
      window.alert(`${data.sender}: ${data.msg}`);
    }

  }

  let App = {
    mySocketId: '',
    myName: '',
    users: [],
    numUsers: 0,

    init: function() {
      App.cacheElements();
      App.bindEvents();
      App.myName = window.prompt('SCREEN NAME: ');
      IO.socket.emit('setname', { name: App.myName, socketId: App.mySocketId, id: App.numUsers });
    },

    cacheElements: function() {
      // App.doc = document;
      App.msgBox = document.getElementById('msgBox');
      App.msgBtn = document.getElementById('msgBtn');
      App.userList = document.getElementById('userList');
      App.messages = document.getElementById('messages');
      App.rooms = document.getElementById('rooms');
    },

    bindEvents: function() {
      App.msgBtn.addEventListener('click', App.sendMsgClick);
    },

    sendMsgClick: function() {
      if (App.msgBox.value != '') {
        let data = {
          name: App.myName,
          msg: App.msgBox.value
        };
        IO.socket.emit('userSendsMsg', data);
        App.msgBox.value = '';
      } else {
        window.alert('Sean and Nick are clowns.');
      }
    },

    sendDm: function(id) {
      let data = {
        sender: App.myName,
        receiverId: id,
        dm: window.prompt('DM: ')
      };
      IO.socket.emit('sendDm', data);
    }

  }

  IO.init();
  App.init();

})();
