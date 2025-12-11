import amqp from "amqplib";

async function sendOrderCreatedEvent(orderId, customerId) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queue = "order_created_queue";

  await channel.assertQueue(queue, { durable: true });

  const event = {
    orderId,
    customerId,
    status: "created",
  };

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)), {
    persistent: true,
  });

  console.log(`Order ${orderId} created and event sent`);

  await channel.close();
  await connection.close();
}

sendOrderCreatedEvent("1", "99");
