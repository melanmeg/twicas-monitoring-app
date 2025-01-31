import express from "express";
import amqp from "amqplib";
import { Config } from "./environments.js";
import { IncomingWebHookResponse } from "./interfaces.js";

const sendMessageToQueue = async (queue: string, message: string) => {
  try {
    const rabbitMQUrl = `amqp://${Config.RABBITMQ_USER}:${Config.RABBITMQ_PASSWORD}@${Config.RABBITMQ_URL}:${Config.RABBITMQ_PORT}`;
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, {
      durable: false,
    });

    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Message sent: ${message}`);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("RabbitMQ connection error:", error);
  }
};

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  const body: IncomingWebHookResponse = req.body;
  const queue: string = "my_queue";
  const message: string = JSON.stringify(body);
  const is_live: boolean = body.broadcaster.is_live;

  if (queue && message && is_live) {
    await sendMessageToQueue(queue, message);
    res.status(200).send("Message has been sent");
  } else {
    res
      .status(400)
      .send("Error: Queue, message, or is_live is missing or invalid");
  }
});

app.listen(Config.PORT_NUM, () => {
  console.log(`Server is listening on port ${Config.PORT_NUM}`);
});
