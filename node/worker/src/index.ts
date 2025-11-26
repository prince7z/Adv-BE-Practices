import {createClient} from "redis";

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


async function processJobs(submission: string) {
    const {psid, code, lang} = JSON.parse(submission);
    console.log(`Processing submission for PSID: ${psid}, Language: ${lang}`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`Completed processing submission for PSID: ${psid}`,code, lang);

    new Promise(async (resolve, reject) => {
        client.PUBLISH(`psid_${psid}`, JSON.stringify({
            status: "completed",
            output: `Processed code in ${lang} successfully!`
        }));
        resolve(true);
    });
}

async function workerLoop() {
    try{
        console.log("inside worker loop");
        while (true) {
            try{
                console.log("waiting for submission...");
                const result = await client.brPop("submissions", 0);
                console.log("Received submission:", result);
                if (result) {
                    // In Redis v5.x, brPop returns an object like: { key: 'submissions', element: 'value' }
                    const { key, element: value } = result;
                    await processJobs(value);
                }
                
            }catch (error) {
                console.error("Worker loop error:", error);
            }
        }
    } catch (error) {
        console.error("Could not connect to Redis or start worker loop:", error);
    }
}

async function startworker(){
  try {
    await client.connect();
    console.log("Connected to Redis");
    workerLoop();
    // Worker logic would go here, e.g., processing jobs from a queue
  }catch (error) {
    console.error("Could not connect to Redis or start worker:", error);
   }
}

startworker();
