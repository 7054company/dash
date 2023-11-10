const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const loginModule = require('./login');
const dashboardModule = require('./dashboard');

const app = express();
const PORT = 3000;

// Middleware to retrieve the client's IP address
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  req.clientIP = ip;
  next();
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Both username and password are required.' });
  }

  const userData = loginModule.loadUserData();
  const user = userData.find(u => u.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  // Redirect to the /dashboard route with the welcome message and IP address
  res.redirect(`/dashboard?username=${username}&ip=${req.clientIP}`);
});

app.get('/dashboard', (req, res) => {
  const { username, ip } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  const welcomeMessage = dashboardModule.getWelcomeMessage(username, ip);
  res.status(200).json({ message: welcomeMessage });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
