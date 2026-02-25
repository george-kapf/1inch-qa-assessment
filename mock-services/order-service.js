const express = require('express');
const app = express();
const PORT = parseInt(process.env.PORT ?? '3002', 10);

app.use(express.json());

let orders = [{ orderId: 1, userId: 1, amount: 49.99 }];
let nextOrderId = 2;

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/orders', (req, res) => {
  const userId = parseInt(req.query.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'userId query parameter is required and must be a number' });
  }

  const userOrders = orders.filter((o) => o.userId === userId);
  return res.status(200).json(userOrders);
});

app.post('/orders', (req, res) => {
  const { userId, amount } = req.body ?? {};

  if (userId == null || typeof userId !== 'number') {
    return res.status(400).json({ error: 'userId is required and must be a number' });
  }

  if (amount == null || typeof amount !== 'number') {
    return res.status(400).json({ error: 'amount is required and must be a number' });
  }

  const newOrder = {
    orderId: nextOrderId++,
    userId,
    amount,
  };

  orders.push(newOrder);
  return res.status(200).json(newOrder);
});

app.listen(PORT, () => {
  console.log(`Order Service running on http://localhost:${PORT}`);
});
