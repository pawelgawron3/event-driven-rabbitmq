const amqp = require("amqplib");

async function processOrderCreated(msg) {
  const event = JSON.parse(msg.content.toString());
  const orderId = event.orderId;

  console.log(`Processing payment for order ${orderId}`);

  setTimeout(() => {
    sendPaymentProcessedEvent(orderId);
  }, 1000);
}

async function sendPaymentProcessedEvent(orderId) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = connection.createChannel();
  const queue = "payment_processed_queue";

  await channel.assertQueue(queue, { durable: true });

  const event = {
    orderId,
    status: "paid",
  };

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)), {
    persistent: true,
  });

  console.log(`Payment processed for order ${orderId}. Event sent`);

  await channel.close();
  await connection.close();
}

async function consumeOrderCreatedEvent() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queue = "order_created_queue";

  await channel.assertQueue(queue, { durable: true });

  console.log("Waiting for order created events...");
  channel.consume(queue, processOrderCreated, { noAck: false });
}

consumeOrderCreatedEvent();
