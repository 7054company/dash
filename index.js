
// index.js

const express = require('express');
const api = require('./api'); // Assuming api.js is in the same directory
const app = express();
const port = 3000;

app.use(express.json());

// Serve static files from the 'views' directory
app.use(express.static(__dirname + '/views'));

// Route for the root page
app.get('/', (req, res) => {
  res.send('Get started');
});

// Route for the dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/views/dashboard.html');
});

// Route for the login page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

// Route for the API login endpoint
app.post('/api/login', (req, res) => {
  const { user, password } = req.body;
  const userData = api.readUserData(); // Read user data from the file

  const result = api.verifyLogin(userData, user, password);

  res.json(result);
});

// Route for the API account endpoint
app.get('/api/account', (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing token' });
  }

  const result = api.getUserDetails(token);

  res.json(result);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
