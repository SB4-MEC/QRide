const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

// Set up the Express app and the HTTP server
const app = express();
const server = http.createServer(app);

// Set up Socket.io on the server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000" // Replace with your client's URL if different
  }
});

// Use cors middleware with specific origin
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Use body-parser middleware to handle POST requests
app.use(bodyParser.json());

// Endpoint for admin to post messages
app.post('/admin/message', (req, res) => {
  const { message } = req.body;
  if (message) {
    io.emit('notification', message); // Broadcast the message to all clients
    return res.status(200).send({ success: true });
  }
  return res.status(400).send({ success: false, error: 'Message is required' });
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server on port 4000
server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
