# event-driven-rabbitmq

This project is a simple demonstration of **Event-Driven Architecture (EDA)** using Node.js and RabbitMQ. It consists of three microservices that communicate asynchronously through events: **Order Service**, **Payment Service**, and **Shipping Service**.

---

## Prerequisites

- **Node.js**
- **npm** (comes with Node.js)
- **RabbitMQ broker** running locally (using Docker is easiest)

Start RabbitMQ with Docker:

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
```

- Management panel: http://localhost:15672
- Default login: guest / guest

Install amqplib library using npm install.

## Running the Services

Run each microservice in a separate terminal. The recommended order is:

- Shipping Service (waits for payment events) -> npm run shipping
- Payment Service (processes orders and sends payment events) -> npm run payment
- Order Service (creates new orders every 10 seconds) -> npm run order

## How It Works

1. Order Service emits order_created events.
2. Payment Service listens for order_created, processes payments, and emits payment_processed events.
3. Shipping Service listens for payment_processed and simulates order shipment.

All communication between services is asynchronous via RabbitMQ queues:

- order_created_queue
- payment_processed_queue

## Resetting Queues

Before restarting tests, you can clear RabbitMQ queues using:

```bash
npm run reset-queues
```
