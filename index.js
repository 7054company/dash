const express = require('express');
const session = require('express-session');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for session management
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Read user credentials from data.txt
const users = {};
fs.readFileSync('data.txt', 'utf-8').split('\n').forEach(line => {
  const [uid, username, password] = line.trim().split(' ');
  users[username] = { uid, password, lastLoginIP: null, sessionId: null };
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

    // Generate a session ID and save it in the user object and in the session
    const sessionId = generateSessionId();
    users[username].sessionId = sessionId;
    req.session.userId = username;

    // Display a success message and redirect to /dashboard upon successful login
    return res.send(`Login successful. Welcome to the dashboard, ${username}! <a href="/dashboard">Go to Dashboard</a>`);
  }

  // If login is unsuccessful, show an error message
  res.send('Invalid login credentials. Please try again.');
});

app.get('/dashboard', (req, res) => {
  // Check if the user is authenticated by verifying the session ID
  const userId = req.session.userId;
  if (userId && users[userId] && req.sessionID === users[userId].sessionId) {
    return res.send(`Welcome to the dashboard, ${userId}!`);
  }

  // If not authenticated, redirect to login
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Helper function to generate a session ID (for demonstration purposes)
function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
