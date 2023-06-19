const { Server } = require("socket.io");
const { createServer } = require("http");

const httpServer = createServer(app);

const io = new Server(httpServer, {});
io.on("connection", () => {
  console.log("a user connected");
});
