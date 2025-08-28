import { MongoClient } from "mongodb";
import WebSocket, { WebSocketServer } from "ws";

const client = new MongoClient(process.env.MONGO_URI);

async function start() {
  await client.connect();
  const db = client.db("store_db"); // your DB name
  const orders = db.collection("orders");

  // WebSocket server
  const wss = new WebSocketServer({ port: process.env.PORT || 4000 });
  console.log("✅ WebSocket server running");

  // Watch MongoDB changes
  const changeStream = orders.watch();

  changeStream.on("change", (change) => {
    console.log("📢 Order change:", change);

    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(change));
      }
    });
  });

  wss.on("connection", (ws) => {
    console.log("🟢 Flutter connected");
    ws.send(JSON.stringify({ message: "Connected to orders feed" }));
  });
}

start().catch(console.error);
