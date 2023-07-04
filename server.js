// const express = require('express');
// const cors = require('cors')
// const app = express();

// app.use(cors());

// app.use('/login', (req, res) => {
//   res.send({
//     token: 'test123'
//   });
// });

// app.listen(8080, () => console.log('API is running on http://localhost:8080/login'));

const express = require("express");
const socket = require("socket.io");
const app = express();

const server = app.listen(8010, () => {
  console.log("Listening on port 8010");
});

const io = socket(server);

io.on("connection", (socket) => {
  socket.removeAllListeners()
  socket.on("message", (msg) => {
    console.log("socket working at the backend", msg);
    io.sockets.emit("message", msg);
  });

  // Handle the "newCategory" event
  socket.on("newCategory", (category) => {
    // Emit the "categoryAdded" event to all connected clients
    io.emit("categoryAdded", category);
  });

  // Handle the "updateCategory" event
  socket.on("updateCategory", (category) => {
    // Emit the "categoryUpdated" event to all connected clients
    io.emit("categoryUpdated", category);
  });

  // Handle the "deleteCategory" event
  socket.on("deleteCategory", (category) => {
    // Emit the "categoryDeleted" event to all connected clients
    io.emit("categoryDeleted", category);
  });
});
