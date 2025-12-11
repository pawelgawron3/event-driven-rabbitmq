import amqp from "amqplib";

// 10_000 = 10s
const INTERVAL_MS = 10000;

async function sendOrderCreatedEvent(orderId, customerId) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queue = "order_created_queue";

  await channel.assertQueue(queue, { durable: true });

  const event = {
    orderId,
    customerId,
    status: "created",
    createdAt: new Date().toISOString(),
  };

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)), {
    persistent: true,
  });

  console.log(`Order ${orderId} created and event sent`);

  await channel.close();
  await connection.close();
}

let counter = 1;

function start() {
  console.log(
    `Automatic order generation started: every ${INTERVAL_MS / 1000} seconds`
  );

  setInterval(() => {
    const orderId = `${Date.now()}-${counter}`;
    const customerId = `${counter}`;

    sendOrderCreatedEvent(orderId, customerId).catch((err) => {
      console.error("Error:", err);
    });

    counter++;
  }, INTERVAL_MS);
}

start();
