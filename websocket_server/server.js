const WebSocket = require('ws');
const fs = require('fs');

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });
const jsonFilePath = './logs.json';

console.log('WebSocket server started on ws://localhost:8080');

wss.on('connection', function connection(ws) {
  console.log('A new client connected.');

  fs.readFile(jsonFilePath, (err, data) => {
    if (err) throw err;
    const content = JSON.parse(data);
    previousStatus = content.message;
  });

  fs.watch(jsonFilePath, (eventType, filename) => {
    if (filename) {
      fs.readFile(jsonFilePath, (err, data) => {
        try {
          const content = JSON.parse(data);
          console.log("content : ", content)
          // if (previousStatus !== content.message) {
            ws.send(JSON.stringify(content.message));
            // broadcastMessage("WARNING: Status changed to SLEEPING!");
          // }
          previousStatus = content.message;
        } catch (parseError) {
          console.log(`Error parsing JSON from ${filename}:`, parseError);
        }
      });
    }
  });

  // Send a welcome message to the newly connected client
  ws.send(JSON.stringify({'message' : 'Welcome to the WebSocket server!'}));
});

// Optional: Implement logic to monitor file changes and broadcast updates
