const express = require('express');
const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

app.use(express.json());

const users = [{ id: 1, name: 'Alice', email: 'alice@example.com' }];

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'id must be a number' });
  }

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json(user);
});

app.listen(PORT, () => {
  console.log(`User Service running on http://localhost:${PORT}`);
});
