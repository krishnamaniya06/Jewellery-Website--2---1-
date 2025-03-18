const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ MySQL Connection - use the connection pool from db.js
const db = require('./models/db');

// No need for db.connect since we're using a pool

// ✅ Register Route
app.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    const [checkResult] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    
    if (checkResult.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);
    
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

// ✅ Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [results] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Welcome to the page' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

// ✅ Subscription Route
app.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    // Insert the subscription email into the database
    await db.execute('INSERT INTO subscriptions (email) VALUES (?)', [email]);
    res.status(201).json({ message: 'Subscription successful' });
  } catch (err) {
    console.error('Error inserting subscription:', err);
    res.status(500).json({ message: 'Database insert error' });
  }
});

// ✅ Routes for authentication and product management
app.use("/api/auth", authRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);

// ✅ Server Listening
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
