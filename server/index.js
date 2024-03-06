const { Server } = require("socket.io");
const { createServer } = require("node:http");
const express = require("express");
const ip = require('ip');
const os = require('os');

const app = express();
const webServer = createServer(app);
const wsServer = new Server(webServer, {
  path: '/ws'
});

app.get("/", (_, res) => {
  return res.sendFile(__dirname + "/index.html");
});

app.get("/hostname", (_, res) => {
  return res.json({
    ip: ip.address(),
    hostname: os.hostname()
  });
});

const clients = {};
const connectedClients = {};

wsServer.on("connection", (client) => {
  clients[client.id] = client.client.conn.remoteAddress;
  connectedClients[client.id] = client;
  console.log("user connected:", client.id);
  
  client.on("get-clients", () => {
    client.emit("recieve-clients", clients);
  });
  
  client.on("send-msg", (userid, msg) => {
    if (!(userid in connectedClients)) {
      return;
    }
    connectedClients[userid].emit('revieve-msg', client.id, msg);
  });

  client.on('disconnect', () => {
    console.log("user disconnected:", client.id);
    delete clients[client.id];
    delete connectedClients[client.id];
  });
});

webServer.listen(3000, () => {
	console.log("server listening in http://localhost:3000");
});