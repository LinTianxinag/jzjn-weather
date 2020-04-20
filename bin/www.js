#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('weather:server');
// var http = require('http');
var net = require('net');

/**
 * Get port from environment and store in Express.
 */

// var port = normalizePort(process.env.PORT || '8192');
var port =  '8192';
app.set('port', port);

/**
 * Create HTTP server.
 */

// var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

// server.listen(port);
// server.on('error', onError);
// server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

// function normalizePort(val) {
//   var port = parseInt(val, 10);
//
//   if (isNaN(port)) {
//     // named pipe
//     return val;
//   }
//
//   if (port >= 0) {
//     // port number
//     return port;
//   }
//
//   return false;
// }
//
// /**
//  * Event listener for HTTP server "error" event.
//  */
//
// function onError(error) {
//   if (error.syscall !== 'listen') {
//     throw error;
//   }
//
//   var bind = typeof port === 'string'
//     ? 'Pipe ' + port
//     : 'Port ' + port;
//
//   // handle specific listen errors with friendly messages
//   switch (error.code) {
//     case 'EACCES':
//       console.error(bind + ' requires elevated privileges');
//       process.exit(1);
//       break;
//     case 'EADDRINUSE':
//       console.error(bind + ' is already in use');
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// }
//
// /**
//  * Event listener for HTTP server "listening" event.
//  */
//
// function onListening() {
//   var addr = server.address();
//   var bind = typeof addr === 'string'
//     ? 'pipe ' + addr
//     : 'port ' + addr.port;
//   debug('Listening on ' + bind);
// }


server = net.createServer(function(sock){
    //
    sock.setEncoding('binary');
    sock.setKeepAlive(true);
    let remoteAddress = sock.remoteAddress;
    let remotePort = sock.remotePort;

    sock.on('data', function(data, oldBuffer){

        console.log('data----------');
        console.log(data);
        sock.write('ok');
        // let key = `${remoteAddress}:${remotePort}`;




        //process message
    });

    sock.on('error', function(exception){
        // log.debug('sock error ', exception);
    });

    sock.on('close', function(data){

    });

    sock.on('timeout', ()=>{

    });
}).listen(port);

server.on('listening',function(){
    log.info( "server listening on: " + server.address().port);
});
server.on('connection', function (socket) {
    log.info('connection ', socket.remoteAddress+":"+socket.remotePort);

});
