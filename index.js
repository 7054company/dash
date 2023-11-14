const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();
const port = 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory cache to store authentication tokens
const tokenCache = {};

// Read user credentials from data.txt
const users = {};
fs.readFileSync('data.txt', 'utf-8').split('\n').forEach(line => {
  const [uid, username, password] = line.trim().split(' ');
  users[username] = { uid, password, lastLoginIP: null, authToken: null };
});

app.get('/', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form action="/login" method="post">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required>
      <br>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required>
      <br>
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the provided credentials match the values from data.txt
  if (users[username] && users[username].password === password) {
    // Update lastLoginIP for the user
    users[username].lastLoginIP = req.ip;

    // Generate an authentication token and save it in the user object and in the cache
    const authToken = generateAuthToken();
    users[username].authToken = authToken;
    tokenCache[authToken] = username;

    // Display a success message with the authentication token
    return res.send(`Login successful. Welcome to the dashboard, ${username}! Your authentication token is: ${authToken} <a href="/dashboard">Go to Dashboard</a>`);
  }

  // If login is unsuccessful, show an error message
  res.send('Invalid login credentials. Please try again.');
});

app.get('/dashboard', (req, res) => {
  const authToken = req.headers.authorization;

  // Check if the authentication token is valid
  const username = tokenCache[authToken];
  if (username && users[username] && users[username].authToken === authToken) {
    return res.send(`Welcome to the dashboard, ${username}!`);
  }

  // If not authenticated, redirect to login
  return res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Helper function to generate an authentication token
function generateAuthToken() {
  return crypto.randomBytes(24).toString('hex');
}
