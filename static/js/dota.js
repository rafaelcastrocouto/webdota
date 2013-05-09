$(function(){
  // Socket.io
  var socket = io.connect(location.origin);
  socket.emit('event', {id: 'the id is X'});
  socket.on('idEvent', function (data){ 
      document.body.textContent = data.id;
  });
});