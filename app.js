var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var see=require('./bin/www');



var routes = require('./routes/index');
var users = require('./routes/users');

var apis=require('./routes/apiv1');


var app = express();
var http=require('http');
var seerver=http.createServer(app).listen(8081);
var socketApi = require('./socketApi');

//seerver.listen('3031')
var io=require('socket.io')(seerver);
//var io=socketApi.io;
var opdroutes=require('./routes/opd')(io);
var appointment=require('./models/appointment_model');

io.on('connection',function(socket){
      console.log("user connected");
      socket.on('getcounter',function(data){
          var doc_id=data.doc_id;
          var data={
            "doc_id":doc_id
          }
          console.log(data);
          appointment.getOpdCounter(data,function(err,result){
            if(err){
              
            }
            else{
              console.log(result);
              socket.emit('counter',result);
            }
          });
      });
      socket.on('updateopd',function(data){
          var doc_id=data.doc_id;
          var opd_token=data.opd_token;
          
      });
});
app.io=io;



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/api/v1',apis);

app.use('/apiv1/opd',opdroutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
module.exports = app;