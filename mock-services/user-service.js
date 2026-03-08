const express = require('express');
const app = express();

/** * PHASE 4: MOCK SERVICE IMPLEMENTATION
 * This service runs in a Linux Docker container and simulates the User Identity API.
 * It listens on Port 3001 as per the assessment requirements.
 */
const PORT = parseInt(process.env.PORT ?? '3001', 10);

// Middleware to parse incoming JSON.
app.use(express.json());

// In-memory data for User 1 (Alice). 
// This provides the "Source of Truth" for the first step of the BDD journey.
const users = [{ id: 1, name: 'Alice', email: 'alice@example.com' }];

/**
 * HEALTHCHECK ENDPOINT
 * Used by Docker Compose and the 'Before' hook to confirm the User Service 
 * is "Healthy" before the test runner attempts to connect.
 */
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

/**
 * GET USER BY ID
 * Requirement: Must succeed with an HTTP 200 and include id, name, and email.
 */
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  // Validation to handle malformed requests (e.g., /users/abc).
  if (isNaN(id)) {
    return res.status(400).json({ error: 'id must be a number' });
  }

  // Locates User 1 in our mock data array.
  const user = users.find((u) => u.id === id);

  // Returns 404 if the test requests a user ID that doesn't exist in our mock.
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Successful response: Returns the User 1 object to the Playwright client.
  return res.status(200).json(user);
});

// Starts the service on the designated port.
app.listen(PORT, () => {
  console.log(`User Service running on http://localhost:${PORT}`);
});
