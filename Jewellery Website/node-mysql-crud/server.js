// const express = require('express');
// const mysql = require('mysql2');
// const bcrypt = require('bcryptjs');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const authRoutes = require("./routes/authRoutes");
// const productRoutes = require("./routes/productRoutes");

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // MySQL Connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',         // Your MySQL username
//   password: '',         // Your MySQL password (leave empty if not set)
//   database: 'e-commerce' // Your database name
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//     return;
//   }
//   console.log('Database connected');
// });

// // Register Route
// app.post('/register', async (req, res) => {
//   const { email, password, role } = req.body;
  
//   const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
//   db.query(checkEmailQuery, [email], async (err, result) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }

//     if (result.length > 0) {
//       return res.status(400).json({ message: 'Email already exists' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const query = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
//     db.query(query, [email, hashedPassword, role], (err, result) => {
//       if (err) {
//         console.error('Error inserting data:', err);
//         return res.status(500).json({ message: 'Database insert error' });
//       }
//       res.status(201).json({ message: 'Registered successfully' });
//     });
//   });
// });

// // Login Route
// app.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   const query = 'SELECT * FROM users WHERE email = ?';
//   db.query(query, [email], async (err, result) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }

//     if (result.length === 0) {
//       return res.status(400).json({ message: 'User not found' });
//     }

//     const user = result[0];
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     res.json({ message: 'Welcome to the page' });
//   });
// });




// app.use("/api/auth", authRoutes);
// app.use('/uploads', express.static('uploads'));
// app.use("/api/products", productRoutes);

// // Server Listening
// app.listen(5000, () => {
//   console.log('Server is running on port 5000');
// });







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

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // Your MySQL username
  password: '',         // Your MySQL password (leave empty if not set)
  database: 'e-commerce' // Your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Database connected');
});

// ✅ Register Route
app.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], async (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
    db.query(query, [email, hashedPassword, role], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ message: 'Database insert error' });
      }
      res.status(201).json({ message: 'Registered successfully' });
    });
  });
});

// ✅ Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Welcome to the page' });
  });
});

// ✅ Subscription Route
app.post('/subscribe', (req, res) => {
  const { email } = req.body;

  // Insert the subscription email into the database
  const query = 'INSERT INTO subscriptions (email) VALUES (?)';
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error('Error inserting subscription:', err);
      return res.status(500).json({ message: 'Database insert error' });
    }

    res.status(201).json({ message: 'Subscription successful' });
  });
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
