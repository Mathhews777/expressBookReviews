const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_auth_router = require('./router/auth_users.js');
const general_router = require('./router/general.js');
const users = require('./router/usersdb'); // Import the users array from usersdb.js

const app = express();
app.use(express.json());

// Registration route
app.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    // Check if the username is already taken
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' });
    }
  
    // Store user data in the in-memory storage
    users.push({ username, password });
  
    res.status(200).json({ message: 'Registration successful' });
});

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Custom authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    const token = req.session.authorization.accessToken;
    jwt.verify(token, 'access', (err, user) => {
      if (!err) {
        req.user = user;
        next(); // User is authenticated, proceed to the next middleware
      } else {
        res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    res.status(403).json({ message: "User not logged in" });
  }
});

// Use the router instances
app.use("/customer", customer_auth_router);
app.use("/", general_router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = 5000;
app.listen(PORT, () => console.log("Server is running"));
