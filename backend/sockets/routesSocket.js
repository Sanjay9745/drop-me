module.exports = (socket) => {
    console.log('A user connected to /routes namespace');
  
    // Example: Listen for a custom event
    socket.on('getRoute', (routeId) => {
      console.log(`Fetching route with ID: ${routeId}`);
      // Emit a response
      socket.emit('routeData', { id: routeId, startLocation: 'X', endLocation: 'Y' });
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected from /routes namespace');
    });
  };