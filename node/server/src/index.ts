import express from "express";
import { createClient } from "redis";    

const app = express();
app.use(express.json());

// Use Docker service name and environment variables
const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

client.on("connect", () => console.log("Redis connected"));
client.on("ready", () => console.log("Redis ready"));
client.on("error", (err) => console.error("Redis error:", err));
client.on("end", () => console.log("Redis connection ended"));





app.get("/submit", async (req, res) => {
const {psid, code, lang} = req.body;
  if (!psid || !code || !lang) {
    return res.status(400).json({ error: "Missing required fields" });
  }
try {
  await client.lPush(`submissions`, JSON.stringify({ psid,code, lang }));
  
  // subscribe to the psid channel and respond when a message is received
  await client.subscribe(`psid_${psid}`, async (message) => {
    console.log(`Message for psid_${psid}:`, message);
    try {
      await client.unsubscribe(`psid_${psid}`);
      console.log(`Unsubscribed from psid_${psid}`);
      res.json({ result: JSON.parse(message) });
    } catch (err) {
      console.error("Error sending response:", err);
    }
  });
} catch (error) {
  console.error("Error queuing submission:", error);
  res.status(500).json({ error: "Failed to queue submission" });
}
});

async function startserver(){
  try {
    await client.connect();
    console.log("Connected to Redis");
    app.listen(3000, () => {
    console.log("express Server is starting on port 3000...");
});
  }catch (error) {
    console.error("Could not connect to Redis or start server:", error);
   }
}


startserver();  