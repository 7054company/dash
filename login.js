// login.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const usersPath = path.join(__dirname, 'data.txt');

// Read user data from data.txt
let users = [];

try {
  const data = fs.readFileSync(usersPath, 'utf-8');
  users = JSON.parse(data);
} catch (error) {
  console.error('Error reading data.txt:', error);
}

// Login route
router.post('/', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Both username and password are required.' });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  // You might want to implement a session or token mechanism for a real application
  // For this example, just sending a success message
  res.status(200).json({ message: 'Login successful!' });
});

module.exports = router;
