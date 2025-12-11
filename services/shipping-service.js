const amqp = require("amqplib");

async function processPaymentProcessed(msg) {
  const event = JSON.parse(msg.content.toString());
  const orderId = event.orderId;

  console.log(`Shipping order ${orderId}`);

  setTimeout(() => {
    console.log(`Order ${orderId} shipped`);
  }, 1000);
}

async function consumePaymentProcessedEvent() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queue = "payment_processed_queue";

  await channel.assertQueue(queue, { durable: true });

  console.log("Waiting for payment processed events...");
  channel.consume(queue, processPaymentProcessed, { noAck: false });
}

consumePaymentProcessedEvent();
