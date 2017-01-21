

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
      IO.socket.on('userLeftChat', IO.userLeaves);
      IO.socket.on('addMsg', IO.postMsg);
      IO.socket.on('sendingDm', IO.receiveDm);
    },

    onConnected: function() {
      App.mySocketId = IO.socket.socket.sessionid;
      App.numUsers++;
    },

    refreshList: function(data) {
      App.userList.innerHTML = '';
      data.users.forEach((user) => {
        App.users.push(user);
        let node = document.createElement('div');
        node.setAttribute('class', 'userName');
        node.id = user.id;
        let textnode = document.createTextNode(user.name);
        node.appendChild(textnode);
        App.userList.appendChild(node);
      });
    },

    newUserJoins: function(data) {
      App.messages.innerHTML += `${data.name} has joined the chat.<br />`;
    },

    userLeaves: function(data) {
      App.messages.innerHTML += `${data.user} left the chat.<br />`;
    },

    postMsg: function(data) {
      App.messages.innerHTML += `${data.name}: ${data.msg}<br />`;
    },

    receiveDm: function(dm) {
      window.alert(`${dm.sender}: ${dm.msg}`);
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
      App.myName = App.getName();
      IO.socket.emit('setname', { name: App.myName, socketId: App.mySocketId, id: App.numUsers });
    },

    cacheElements: function() {
      // App.doc = document;
      App.msgBox = document.getElementById('msgBox');
      App.msgBtn = document.getElementById('msgBtn');
      App.userList = document.getElementById('userList');
      App.messages = document.getElementById('messages');
      App.dmSidebar = document.getElementById('dmSidebar');
      App.dmTarget = document.getElementById('dmTarget');
      App.dmText = document.getElementById('dmText');
      App.dmBtn = document.getElementById('dmBtn');
    },

    bindEvents: function() {
      App.msgBtn.addEventListener('click', App.sendMsgClick);
      App.dmBtn.addEventListener('click', App.sendDm);
    },

    getName: function() {
      let name;
      while (name == '' || name == undefined) {
        name = window.prompt('SCREEN NAME: ');
      }
      return name;
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
        window.alert('Absolutely not.');
      }
    },

    sendDm: function(event) {
      event.preventDefault();
      if (App.dmTarget.value != '' && App.dmText.value != '') {
        let dm = {
          sender: App.myName,
          receiver: App.dmTarget.value,
          msg: App.dmText.value
        };
        IO.socket.emit('sendDm', dm);
      }
      App.dmTarget.value = '';
      App.dmText.value = '';
    }

  }

  IO.init();
  App.init();

})();
