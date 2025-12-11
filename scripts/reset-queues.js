import amqp from "amqplib";

async function resetQueues() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queues = ["order_created_queue", "payment_processed_queue"];

  console.log("Resetting RabbitMQ queues...");

  for (let queue of queues) {
    try {
      await channel.deleteQueue(queue);
      console.log(`Deleted queue: ${queue}`);
    } catch (err) {
      console.log(`Error with queue "${queue}":`, err.message);
    }
  }

  await channel.close();
  await connection.close();

  console.log("All queues reset!");
}

resetQueues();
