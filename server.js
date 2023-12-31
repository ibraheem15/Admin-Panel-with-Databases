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
// const socket = require("socket.io");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
// const Server = require("socket.io");

// const server = app.listen(8010, () => {
//   console.log("Listening on port 8010");
// });

// const io = socket(server);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});



server.listen(8010, () => {
  console.log("Listening on port 8010");
});

io.on("connection", (socket) => {
  console.log("Socket ID: " + socket.id);
  socket.on("message", (msg) => {
    console.log("socket working at the backend", msg);
    io.sockets.emit("message", msg);
  });

  // Handle the "newCategory" event
  socket.on("newCategory", (category) => {
    // Emit the "categoryAdded" event to all connected clients
    // io.emit("categoryAdded", category);
    socket.broadcast.emit("categoryAdded", category);
  });

  // Handle the "updateCategory" event
  socket.on("updateCategory", (category) => {
    // Emit the "categoryUpdated" event to all connected clients
    // io.emit("categoryUpdated", category);
    socket.broadcast.emit("categoryUpdated", category);
  });

  // Handle the "deleteCategory" event
  socket.on("deleteCategory", (category) => {
    // Emit the "categoryDeleted" event to all connected clients
    socket.broadcast.emit("categoryDeleted", category);
  });

  //products
  socket.on("newProduct", (product) => {
    // Emit the "productAdded" event to all connected clients
    socket.broadcast.emit("productAdded", product);
  });

  // Handle the "updateProduct" event
  socket.on("updateProduct", (product) => {
    // Emit the "productUpdated" event to all connected clients
    socket.broadcast.emit("productUpdated", product);
  });

  // Handle the "deleteProduct" event
  socket.on("deleteProduct", (product) => {
    // Emit the "productDeleted" event to all connected clients
    socket.broadcast.emit("productDeleted", product);
  });

  socket.on("updateUser", (user) => {
    // Emit the "userUpdated" event to all connected clients
    io.emit("userUpdated", user);
  });

  //disconnect
  socket.on("disconnect", () => {
    console.log("disconnet Socket ID: " + socket.id);
    // socket.removeAllListeners();
  });
});
