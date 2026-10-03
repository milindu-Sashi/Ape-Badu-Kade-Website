import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname);
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'ape_badu_kade.sqlite');
const SEED_PRODUCTS_FILE = path.join(__dirname, '..', 'data', 'products.json');
const SEED_ORDERS_FILE = path.join(__dirname, '..', 'data', 'orders.json');

let db = null;

// Save SQLite database to disk
const saveDatabase = () => {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    console.error('Error saving SQLite database:', err);
  }
};

// Helper to convert SQLite query results into array of objects
const queryAll = (sql, params = []) => {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
};

// Helper to query single row
const queryOne = (sql, params = []) => {
  const rows = queryAll(sql, params);
  return rows.length > 0 ? rows[0] : null;
};

// Initialize DB and Tables
export const initDatabase = async () => {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const filebuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(filebuffer);
    console.log('📦 Loaded existing SQLite database from disk.');
  } else {
    db = new SQL.Database();
    console.log('📦 Created fresh SQLite database in memory.');
  }

  // 1. Create Admins table
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'Admin',
      created_at TEXT NOT NULL
    );
  `);

  // Default Admin User: admin / admin123
  const existingAdmin = queryOne("SELECT * FROM admins WHERE username = 'admin';");
  if (!existingAdmin) {
    db.run(
      "INSERT INTO admins (username, password, name, role, created_at) VALUES (?, ?, ?, ?, ?);",
      ['admin', 'admin123', 'Ape Badu Kade Admin', 'Super Admin', new Date().toISOString()]
    );
    console.log('👤 Default Admin account initialized: admin / admin123');
  }

  // 2. Create Products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      original_price REAL,
      stock INTEGER NOT NULL DEFAULT 0,
      rating REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 0,
      image TEXT,
      images_json TEXT,
      badge TEXT,
      description TEXT,
      featured INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  // Migrate: add images_json column if missing
  try {
    db.run("ALTER TABLE products ADD COLUMN images_json TEXT;");
  } catch (_) { /* Column already exists */ }

  // 3. Create Orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      customer_address TEXT NOT NULL,
      customer_city TEXT NOT NULL,
      customer_postal TEXT,
      customer_notes TEXT,
      items_json TEXT NOT NULL,
      subtotal REAL NOT NULL,
      discount REAL DEFAULT 0,
      delivery_fee REAL DEFAULT 0,
      total REAL NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      transaction_id TEXT,
      status TEXT NOT NULL DEFAULT 'Pending',
      timeline_json TEXT NOT NULL,
      estimated_delivery_at TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Migrate: add estimated_delivery_at if missing (for existing DBs)
  try {
    db.run("ALTER TABLE orders ADD COLUMN estimated_delivery_at TEXT;");
  } catch (_) { /* column already exists, safe to ignore */ }

  // Seed Products if table is empty
  const prodCount = queryOne("SELECT COUNT(*) as count FROM products;");
  if (prodCount.count === 0 && fs.existsSync(SEED_PRODUCTS_FILE)) {
    try {
      const seedProducts = JSON.parse(fs.readFileSync(SEED_PRODUCTS_FILE, 'utf-8'));
      for (const p of seedProducts) {
        db.run(`
          INSERT INTO products (
            id, name, category, price, original_price, stock, rating, reviews_count,
            image, badge, description, featured, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `, [
          p.id,
          p.name,
          p.category,
          p.price,
          p.originalPrice || p.price,
          p.stock !== undefined ? p.stock : 10,
          p.rating || 5.0,
          p.reviewsCount || 10,
          p.image || '',
          p.badge || '',
          p.description || '',
          p.featured ? 1 : 0,
          new Date().toISOString()
        ]);
      }
      console.log(`📦 Seeded ${seedProducts.length} Sri Lankan products into SQLite.`);
    } catch (e) {
      console.warn('Error seeding products:', e);
    }
  }

  // Seed Orders if table is empty
  const orderCount = queryOne("SELECT COUNT(*) as count FROM orders;");
  if (orderCount.count === 0 && fs.existsSync(SEED_ORDERS_FILE)) {
    try {
      const seedOrders = JSON.parse(fs.readFileSync(SEED_ORDERS_FILE, 'utf-8'));
      for (const o of seedOrders) {
        db.run(`
          INSERT INTO orders (
            id, customer_name, customer_phone, customer_email, customer_address,
            customer_city, customer_postal, customer_notes, items_json,
            subtotal, discount, delivery_fee, total, payment_method,
            payment_status, transaction_id, status, timeline_json, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `, [
          o.id,
          o.customer?.name || '',
          o.customer?.phone || '',
          o.customer?.email || '',
          o.customer?.address || '',
          o.customer?.city || '',
          o.customer?.postalCode || '',
          o.customer?.notes || '',
          JSON.stringify(o.items || []),
          o.subtotal || 0,
          o.discount || 0,
          o.deliveryFee || 0,
          o.total || 0,
          o.paymentMethod || 'cod',
          o.paymentDetails?.status || 'Pending',
          o.paymentDetails?.transactionId || '',
          o.status || 'Pending',
          JSON.stringify(o.timeline || []),
          o.createdAt || new Date().toISOString()
        ]);
      }
      console.log(`📦 Seeded ${seedOrders.length} sample orders into SQLite.`);
    } catch (e) {
      console.warn('Error seeding orders:', e);
    }
  }

  saveDatabase();
  return db;
};

// ================= ADULT REPOSITORIES ================= //

export const AdminRepo = {
  verify: (username, password) => {
    const admin = queryOne("SELECT id, username, name, role FROM admins WHERE username = ? AND password = ?;", [username, password]);
    return admin;
  },
  getById: (id) => {
    return queryOne("SELECT id, username, name, role FROM admins WHERE id = ?;", [id]);
  }
};

export const ProductRepo = {
  getAll: ({ category, search } = {}) => {
    let sql = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (category && category !== 'All') {
      sql += " AND LOWER(category) = LOWER(?)";
      params.push(category);
    }

    if (search) {
      sql += " AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(category) LIKE ?)";
      const pattern = `%${search.toLowerCase()}%`;
      params.push(pattern, pattern, pattern);
    }

    sql += " ORDER BY featured DESC, rowid DESC";

    const rows = queryAll(sql, params);
    return rows.map(r => {
      let imagesList = [];
      try {
        imagesList = r.images_json ? JSON.parse(r.images_json) : [];
      } catch (_) { imagesList = []; }
      if (!Array.isArray(imagesList) || imagesList.length === 0) {
        imagesList = r.image ? [r.image] : ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'];
      }

      return {
        id: r.id,
        name: r.name,
        category: r.category,
        price: r.price,
        originalPrice: r.original_price,
        stock: r.stock,
        rating: r.rating,
        reviewsCount: r.reviews_count,
        image: imagesList[0] || r.image,
        images: imagesList,
        badge: r.badge,
        description: r.description,
        featured: Boolean(r.featured),
        createdAt: r.created_at
      };
    });
  },

  getById: (id) => {
    const r = queryOne("SELECT * FROM products WHERE id = ?;", [id]);
    if (!r) return null;

    let imagesList = [];
    try {
      imagesList = r.images_json ? JSON.parse(r.images_json) : [];
    } catch (_) { imagesList = []; }
    if (!Array.isArray(imagesList) || imagesList.length === 0) {
      imagesList = r.image ? [r.image] : ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'];
    }

    return {
      id: r.id,
      name: r.name,
      category: r.category,
      price: r.price,
      originalPrice: r.original_price,
      stock: r.stock,
      rating: r.rating,
      reviewsCount: r.reviews_count,
      image: imagesList[0] || r.image,
      images: imagesList,
      badge: r.badge,
      description: r.description,
      featured: Boolean(r.featured),
      createdAt: r.created_at
    };
  },

  create: (data) => {
    const id = `prod-${Date.now()}`;
    const now = new Date().toISOString();
    const imagesArray = Array.isArray(data.images) && data.images.length > 0 
      ? data.images 
      : [data.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'];
    const mainImg = imagesArray[0];

    db.run(`
      INSERT INTO products (
        id, name, category, price, original_price, stock, rating, reviews_count,
        image, images_json, badge, description, featured, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, [
      id,
      data.name,
      data.category || 'General',
      Number(data.price),
      data.originalPrice ? Number(data.originalPrice) : Number(data.price),
      data.stock !== undefined ? Number(data.stock) : 10,
      5.0,
      1,
      mainImg,
      JSON.stringify(imagesArray),
      data.badge || 'New',
      data.description || '',
      data.featured ? 1 : 0,
      now
    ]);
    saveDatabase();
    return ProductRepo.getById(id);
  },

  update: (id, data) => {
    const existing = ProductRepo.getById(id);
    if (!existing) return null;

    let imagesArray = existing.images || [existing.image];
    if (Array.isArray(data.images) && data.images.length > 0) {
      imagesArray = data.images;
    } else if (data.image) {
      imagesArray = [data.image];
    }
    const mainImg = imagesArray[0];

    db.run(`
      UPDATE products SET
        name = ?,
        category = ?,
        price = ?,
        original_price = ?,
        stock = ?,
        image = ?,
        images_json = ?,
        badge = ?,
        description = ?,
        featured = ?
      WHERE id = ?;
    `, [
      data.name !== undefined ? data.name : existing.name,
      data.category !== undefined ? data.category : existing.category,
      data.price !== undefined ? Number(data.price) : existing.price,
      data.originalPrice !== undefined ? Number(data.originalPrice) : existing.originalPrice,
      data.stock !== undefined ? Number(data.stock) : existing.stock,
      mainImg,
      JSON.stringify(imagesArray),
      data.badge !== undefined ? data.badge : existing.badge,
      data.description !== undefined ? data.description : existing.description,
      data.featured !== undefined ? (data.featured ? 1 : 0) : (existing.featured ? 1 : 0),
      id
    ]);

    saveDatabase();
    return ProductRepo.getById(id);
  },

  delete: (id) => {
    const existing = ProductRepo.getById(id);
    if (!existing) return false;
    db.run("DELETE FROM products WHERE id = ?;", [id]);
    saveDatabase();
    return true;
  },

  decrementStock: (id, quantity = 1) => {
    db.run("UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?;", [Number(quantity), id]);
    saveDatabase();
  }
};

export const OrderRepo = {
  getAll: () => {
    const rows = queryAll("SELECT * FROM orders ORDER BY created_at DESC;");
    return rows.map(r => ({
      id: r.id,
      customer: {
        name: r.customer_name,
        phone: r.customer_phone,
        email: r.customer_email,
        address: r.customer_address,
        city: r.customer_city,
        postalCode: r.customer_postal,
        notes: r.customer_notes
      },
      items: JSON.parse(r.items_json || '[]'),
      subtotal: r.subtotal,
      discount: r.discount,
      deliveryFee: r.delivery_fee,
      total: r.total,
      paymentMethod: r.payment_method,
      paymentDetails: {
        status: r.payment_status,
        transactionId: r.transaction_id
      },
      status: r.status,
      timeline: JSON.parse(r.timeline_json || '[]'),
      estimatedDeliveryAt: r.estimated_delivery_at || null,
      createdAt: r.created_at
    }));
  },

  getById: (id) => {
    const r = queryOne("SELECT * FROM orders WHERE UPPER(id) = UPPER(?) OR customer_phone = ?;", [id, id]);
    if (!r) return null;
    return {
      id: r.id,
      customer: {
        name: r.customer_name,
        phone: r.customer_phone,
        email: r.customer_email,
        address: r.customer_address,
        city: r.customer_city,
        postalCode: r.customer_postal,
        notes: r.customer_notes
      },
      items: JSON.parse(r.items_json || '[]'),
      subtotal: r.subtotal,
      discount: r.discount,
      deliveryFee: r.delivery_fee,
      total: r.total,
      paymentMethod: r.payment_method,
      paymentDetails: {
        status: r.payment_status,
        transactionId: r.transaction_id
      },
      status: r.status,
      timeline: JSON.parse(r.timeline_json || '[]'),
      estimatedDeliveryAt: r.estimated_delivery_at || null,
      createdAt: r.created_at
    };
  },

  create: (data) => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toISOString().split('T')[0];

    const timeline = [
      { status: 'Placed', time: `${dateString} ${timeString}`, done: true },
      { status: 'Confirmed', time: data.paymentMethod === 'card' ? `${dateString} ${timeString}` : 'Pending', done: data.paymentMethod === 'card' },
      { status: 'Processing', time: 'Pending', done: false },
      { status: 'Shipped', time: 'Pending', done: false },
      { status: 'Delivered', time: 'Pending', done: false }
    ];

    const newStatus = data.paymentMethod === 'card' ? 'Confirmed' : 'Pending';

    db.run(`
      INSERT INTO orders (
        id, customer_name, customer_phone, customer_email, customer_address,
        customer_city, customer_postal, customer_notes, items_json,
        subtotal, discount, delivery_fee, total, payment_method,
        payment_status, transaction_id, status, timeline_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, [
      orderId,
      data.customer.name,
      data.customer.phone,
      data.customer.email || '',
      data.customer.address,
      data.customer.city,
      data.customer.postalCode || '',
      data.customer.notes || '',
      JSON.stringify(data.items),
      Number(data.subtotal || 0),
      Number(data.discount || 0),
      Number(data.deliveryFee || 0),
      Number(data.total || 0),
      data.paymentMethod || 'cod',
      data.paymentDetails?.status || (data.paymentMethod === 'card' ? 'Paid' : 'Pending'),
      data.paymentDetails?.transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      newStatus,
      JSON.stringify(timeline),
      now.toISOString()
    ]);

    // Decrement stock for ordered items
    data.items.forEach(item => {
      ProductRepo.decrementStock(item.id, item.quantity || 1);
    });

    saveDatabase();
    return OrderRepo.getById(orderId);
  },

  updateStatus: (id, newStatus) => {
    const order = OrderRepo.getById(id);
    if (!order) return null;

    const timeline = order.timeline || [];
    const now = new Date();
    const timeString = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const statusLevels = ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const targetIndex = statusLevels.indexOf(newStatus);

    if (targetIndex !== -1) {
      timeline.forEach((step, idx) => {
        if (idx <= targetIndex) {
          step.done = true;
          if (step.time === 'Pending') step.time = timeString;
        } else {
          step.done = false;
          step.time = 'Pending';
        }
      });
    }

    // Real-world City-based delivery time ranges (in minutes)
    const CITY_DELIVERY_MINS = {
      'Colombo':      { min: 15,  max: 25 },   // ~15-25 mins (Express local)
      'Gampaha':      { min: 30,  max: 45 },   // ~30-45 mins
      'Kalutara':     { min: 40,  max: 60 },   // ~1 hour
      'Kandy':        { min: 90,  max: 120 },  // ~1.5 - 2 hours
      'Galle':        { min: 90,  max: 120 },  // ~1.5 - 2 hours
      'Kurunegala':   { min: 90,  max: 120 },  // ~1.5 - 2 hours
      'Matara':       { min: 120, max: 150 },  // ~2 - 2.5 hours
      'Anuradhapura': { min: 150, max: 180 },  // ~2.5 - 3 hours
      'Jaffna':       { min: 240, max: 300 },  // ~4 - 5 hours
      'Batticaloa':   { min: 240, max: 300 },  // ~4 - 5 hours
      'Badulla':      { min: 180, max: 240 },  // ~3 - 4 hours
      'Ratnapura':    { min: 120, max: 150 },  // ~2 - 2.5 hours
      'Trincomalee':  { min: 210, max: 270 },  // ~3.5 - 4.5 hours
      'Other':        { min: 120, max: 180 }
    };

    // Auto-set estimated delivery time when order goes "Out for Delivery"
    let estimatedDeliveryAt = order.estimatedDeliveryAt || null;
    if (newStatus === 'Shipped' && !estimatedDeliveryAt) {
      const city = order.customer?.city || 'Other';
      const range = CITY_DELIVERY_MINS[city] || CITY_DELIVERY_MINS['Other'];
      const minsFromNow = Math.floor(range.min + Math.random() * (range.max - range.min + 1));
      const eta = new Date(now.getTime() + minsFromNow * 60 * 1000);
      estimatedDeliveryAt = eta.toISOString();
    } else if (newStatus === 'Delivered') {
      estimatedDeliveryAt = null; // clear after delivery
    }

    db.run(
      "UPDATE orders SET status = ?, timeline_json = ?, estimated_delivery_at = ? WHERE id = ?;",
      [newStatus, JSON.stringify(timeline), estimatedDeliveryAt, id]
    );

    saveDatabase();
    return OrderRepo.getById(id);
  }
};

export const StatsRepo = {
  getSummary: () => {
    const orders = OrderRepo.getAll();
    const products = ProductRepo.getAll();

    const totalRevenue = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
    const completedOrders = orders.filter(o => o.status === 'Delivered').length;
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      completedOrders,
      totalProducts: products.length,
      lowStockCount,
      outOfStockCount,
      recentOrders: orders.slice(0, 5)
    };
  }
};
