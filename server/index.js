import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  initDatabase, 
  AdminRepo, 
  ProductRepo, 
  OrderRepo, 
  StatsRepo 
} from './database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize SQLite Database before handling requests
await initDatabase();

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    name: 'Ape බඩු කඩේ SQLite API', 
    database: 'SQLite (WebAssembly Persistent)',
    time: new Date() 
  });
});

// ================= ADMIN AUTH ROUTES ================= //

// POST /api/admin/login - Authenticate Admin
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'පරිශීලක නම සහ මුරපදය ඇතුළත් කරන්න (Username and password required)' });
  }

  const admin = AdminRepo.verify(username.trim(), password.trim());
  if (!admin) {
    return res.status(401).json({ error: 'වැරදි පරිශීලක නමක් හෝ මුරපදයකි (Invalid username or password)' });
  }

  // Simple token simulation
  const token = `adm_token_${admin.id}_${Date.now()}`;
  res.json({
    message: 'සාර්ථකව ලොග් විය (Login successful)',
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role
    }
  });
});

// ================= PRODUCT ROUTES (SQLite) ================= //

// GET /api/products - list all products with optional search and category filters
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  const products = ProductRepo.getAll({ category, search });
  res.json(products);
});

// GET /api/products/:id - single product
app.get('/api/products/:id', (req, res) => {
  const product = ProductRepo.getById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'භාණ්ඩය සොයාගත නොහැක (Product not found)' });
  }
  res.json(product);
});

// POST /api/products - create product (Admin)
app.post('/api/products', (req, res) => {
  const { name, category, price, originalPrice, stock, image, description, badge, featured } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ error: 'නම සහ මිල අනිවාර්ය වේ (Name and price are required)' });
  }

  const created = ProductRepo.create({
    name,
    category,
    price,
    originalPrice,
    stock,
    image,
    description,
    badge,
    featured
  });

  res.status(201).json(created);
});

// PUT /api/products/:id - update product (Admin)
app.put('/api/products/:id', (req, res) => {
  const updated = ProductRepo.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'භාණ්ඩය සොයාගත නොහැක' });
  }
  res.json(updated);
});

// DELETE /api/products/:id - delete product (Admin)
app.delete('/api/products/:id', (req, res) => {
  const success = ProductRepo.delete(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'භාණ්ඩය සොයාගත නොහැක' });
  }
  res.json({ message: 'භාණ්ඩය සාර්ථකව ඉවත් කරන ලදී (Product deleted)', id: req.params.id });
});

// ================= ORDER ROUTES (SQLite) ================= //

// GET /api/orders - get all orders (Admin)
app.get('/api/orders', (req, res) => {
  const orders = OrderRepo.getAll();
  res.json(orders);
});

// GET /api/orders/:id - track single order (Customer & Admin)
app.get('/api/orders/:id', (req, res) => {
  const order = OrderRepo.getById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'ඇණවුම සොයාගත නොහැක. කරුණාකර අංකය නැවත පරීක්ෂා කරන්න (Order not found)' });
  }
  res.json(order);
});

// POST /api/orders - place an order (Customer checkout)
app.post('/api/orders', (req, res) => {
  const { customer, items, subtotal, discount, deliveryFee, total, paymentMethod, paymentDetails } = req.body;

  if (!customer || !customer.name || !customer.phone || !customer.address || !items || !items.length) {
    return res.status(400).json({ error: 'අවශ්‍ය සියලුම තොරතුරු ඇතුළත් කරන්න (Please fill all required fields)' });
  }

  const newOrder = OrderRepo.create({
    customer,
    items,
    subtotal,
    discount,
    deliveryFee,
    total,
    paymentMethod,
    paymentDetails
  });

  res.status(201).json({
    message: 'ඔබගේ ඇණවුම සාර්ථකව තහවුරු විය (Order placed successfully)',
    order: newOrder
  });
});

// ================= LIVE ORDER TRACKING (Server-Sent Events) ================= //

// Store SSE clients per orderId: Map<orderId, Set<res>>
const sseClients = new Map();

// GET /api/orders/:id/live  — SSE stream for real-time order updates
app.get('/api/orders/:id/live', (req, res) => {
  const orderId = req.params.id.toUpperCase();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // Register this client
  if (!sseClients.has(orderId)) sseClients.set(orderId, new Set());
  sseClients.get(orderId).add(res);

  // Send current state immediately
  const order = OrderRepo.getById(orderId);
  if (order) {
    res.write(`data: ${JSON.stringify(order)}\n\n`);
  } else {
    res.write(`data: ${JSON.stringify({ error: 'not_found' })}\n\n`);
  }

  // Heartbeat every 25s to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(`: heartbeat\n\n`);
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.get(orderId)?.delete(res);
    if (sseClients.get(orderId)?.size === 0) sseClients.delete(orderId);
  });
});

// Helper: broadcast updated order to all SSE listeners
const broadcastOrderUpdate = (orderId) => {
  const clients = sseClients.get(orderId?.toUpperCase());
  if (!clients || clients.size === 0) return;
  const order = OrderRepo.getById(orderId);
  if (!order) return;
  const payload = `data: ${JSON.stringify(order)}\n\n`;
  clients.forEach(res => res.write(payload));
};

// PATCH /api/orders/:id/status - update order status (Admin)
app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const updated = OrderRepo.updateStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'ඇණවුම සොයාගත නොහැක' });
  }

  // Push live update to all SSE listeners for this order
  broadcastOrderUpdate(req.params.id);

  res.json({ message: 'ඇණවුමේ තත්ත්වය යාවත්කාලීන විය (Order status updated)', order: updated });
});

// ================= STATS / DASHBOARD (SQLite) ================= //

// GET /api/stats - admin analytics
app.get('/api/stats', (req, res) => {
  const summary = StatsRepo.getSummary();
  res.json(summary);
});

// Serve static production build if present
const distPath = path.join(__dirname, '..', 'dist');
import fs from 'fs';
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Ape බඩු කඩේ Server running at http://localhost:${PORT} with SQLite Database`);
});
