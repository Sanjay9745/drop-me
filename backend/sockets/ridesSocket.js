module.exports = (socket) => {
    console.log('A user connected to /rides namespace');
  
    // Example: Listen for a custom event
    socket.on('getRide', (rideId) => {
      console.log(`Fetching ride with ID: ${rideId}`);
      // Emit a response
      socket.emit('rideData', { id: rideId, status: 'ongoing' });
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected from /rides namespace');
    });
  };