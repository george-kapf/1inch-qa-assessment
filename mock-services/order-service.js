const express = require('express');
const app = express();

/** * PHASE 4: MOCK SERVICE IMPLEMENTATION
 * This service runs in a Linux Docker container and simulates the Order API.
 * It listens on Port 3002 as per the assessment requirements.
 */
const PORT = parseInt(process.env.PORT ?? '3002', 10);

// Middleware to parse JSON request bodies for POST operations.
app.use(express.json());

// In-memory data store for the mock session.
// This allows the test to "see" existing data before adding new orders.
let orders = [{ orderId: 1, userId: 1, amount: 49.99 }];
let nextOrderId = 2; // Counter to simulate an auto-incrementing Database ID.

/**
 * HEALTHCHECK ENDPOINT
 * Used by Docker Compose and the 'Before' hook to ensure the service is 
 * fully operational before the test suite begins execution.
 */
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

/**
 * GET ORDERS ENDPOINT
 * Retrieves all orders associated with a specific User ID.
 * Requirement: Must return an HTTP 200 response and an array of orders.
 */
app.get('/orders', (req, res) => {
  const userId = parseInt(req.query.userId, 10);

  // Basic validation to ensure the client provides a userId.
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'userId query parameter is required and must be a number' });
  }

  // Filters the in-memory array to simulate a database query.
  const userOrders = orders.filter((o) => o.userId === userId);
  return res.status(200).json(userOrders);
});

/**
 * POST ORDERS ENDPOINT
 * Handles the creation of a new order for a user (e.g., the 35.95 order).
 * Requirement: Must return an HTTP 200 containing orderId, userId, and amount.
 */
app.post('/orders', (req, res) => {
  const { userId, amount } = req.body ?? {};

  // Structural checks to ensure the mock service receives valid data.
  if (userId == null || typeof userId !== 'number') {
    return res.status(400).json({ error: 'userId is required and must be a number' });
  }

  if (amount == null || typeof amount !== 'number') {
    return res.status(400).json({ error: 'amount is required and must be a number' });
  }

  // Create the new order record using the provided amount (e.g., 35.95).
  const newOrder = {
    orderId: nextOrderId++,
    userId,
    amount,
  };

  // Update the in-memory store and return the object to the test client.
  orders.push(newOrder);
  return res.status(200).json(newOrder);
});

// Starts the service on the designated port.
app.listen(PORT, () => {
  console.log(`Order Service running on http://localhost:${PORT}`);
});
