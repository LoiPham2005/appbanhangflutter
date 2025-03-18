var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');
const uploadDir = 'public/uploads/';

const connectMongoose = require('./config/db')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var APIRouter = require('./routes/api');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Xử lý lỗi socket
io.on('error', (error) => {
  console.error('Socket.IO error:', error);
});

// Xử lý khi client reconnect
io.on('reconnect', (attemptNumber) => {
  console.log('Client reconnected after', attemptNumber, 'attempts');
});

const initializeChatSocket = require('./socketHandlers/chatHandlers');
const initializeNotificationSocket = require('./socketHandlers/notificationHandlers');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

const cors = require('cors');
app.use(cors());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api', APIRouter);

connectMongoose.connect();

// Make io available to our route handlers
app.set('io', io);

// Socket connection logs
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Initialize socket handlers
initializeChatSocket(io);
initializeNotificationSocket(io);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Change app.listen to http.listen
// const port = process.env.PORT || 3000;
// http.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// Make sure to export http instead of app
module.exports = { app, http };
