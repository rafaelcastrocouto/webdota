var process = {
  env: {
    PORT: 8080,
    IP: null
  }
};
var wsURL = 'ws://localhost:8080/'; //ws://dota.rafaelcastrocouto.c9.io
var connect = require('connect');
var app = connect();
var server = require('http').createServer(app);

var csp = function(req, res, next){
  res.setHeader('Content-Security-Policy', 
    "connect-src 'self' "+ wsURL +";"+ 
    "script-src  'self' http://www.google-analytics.com; "+
    "style-src   'self' http://fonts.googleapis.com; "+
    "font-src    'self' http://themes.googleusercontent.com"
  );
  next();
};

app.use(connect.favicon());
app.use(connect.logger('dev'));
app.use(csp);
app.use(connect.static(__dirname))
app.use(connect.directory(__dirname));



//sockets
var socket = require('socket.io');
var io = socket.listen(server);

io.sockets.on('connection', function (socket) {

  socket.on('event', function (data) {
    var id = data.id;
    socket.emit('idEvent', {id: 'Coca-Cola'});
  });

});

server.listen(process.env.PORT, process.env.IP);