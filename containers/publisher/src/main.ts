import express from "express";
import amqp from "amqplib";
import { Config } from "./environments.js";

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

app.post("/send-message", async (req, res) => {
  const { queue, message } = req.body;
  if (queue && message) {
    await sendMessageToQueue(queue, message);
    res.status(200).send("Message has been sent");
  } else {
    res
      .status(400)
      .send("Please include 'queue' and 'message' in the request body");
  }
});

app.listen(Config.PORT_NUM, () => {
  console.log(`Server is listening on port ${Config.PORT_NUM}`);
});
