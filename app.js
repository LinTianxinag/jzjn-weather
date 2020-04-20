var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var weatherRouter = require('./routes/weather');
var net = require('net');

let appRootPath = require('app-root-path');
let dLoad = require('./libs/dload');

let log = require(appRootPath.path + '/libs/log')("app");
var app = express();

{
  global.MySQL = dLoad('/libs/mysql');
}
// function getMac(callback){
//     callback(null, null);
//
// }
//
// getMac(function(err, macAddress){
//     MySQL.Load().then(
//           );
//         }
//     );
// });

//加载mysql 单元
MySQL.Load();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v4', weatherRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var debug = require('debug')('weather:server');



/**
 * Get port from environment and store in Express.
 */

var port =  '8192';
app.set('port', port);


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
    console.log( "server listening on: " + server.address().port);
});
server.on('connection', function (socket) {
    console.log('connection ', socket.remoteAddress+":"+socket.remotePort);

});


module.exports = app;
