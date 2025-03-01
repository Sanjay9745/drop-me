require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const routes = require('./routes');
const initSockets = require('./sockets');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Sync database
db.sequelize.sync().then(() => {
  console.log('Database synced');
});

// Use routes
app.use('/api', routes);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize sockets
initSockets(server);