const socketIO = require('socket.io');

// Initialize Socket.IO
const initSockets = (server) => {
  const io = socketIO(server);

  // Import socket namespaces
  const usersSocket = require('./usersSocket');
  const ridesSocket = require('./ridesSocket');
  const routesSocket = require('./routesSocket');

  // Set up namespaces
  io.of('/users').on('connection', usersSocket);
  io.of('/rides').on('connection', ridesSocket);
  io.of('/routes').on('connection', routesSocket);

  return io;
};

module.exports = initSockets;