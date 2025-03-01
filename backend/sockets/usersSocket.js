module.exports = (socket) => {
    console.log('A user connected to /users namespace');
  
    // Example: Listen for a custom event
    socket.on('getUser', (userId) => {
      console.log(`Fetching user with ID: ${userId}`);
      // Emit a response
      socket.emit('userData', { id: userId, name: 'John Doe' });
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected from /users namespace');
    });
  };