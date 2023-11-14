const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory cache to store user data and authentication tokens
const cache = {};

// Set the views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

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

    // Generate an authentication token
    const authToken = generateAuthToken();
    
    // Save authentication token in user object
    users[username].authToken = authToken;

    // Store user data and authentication token in cache
    cache[authToken] = { ...users[username] };

    // Display a success message with the authentication token and link to the dashboard
    return res.send(`
      Login successful. Welcome to the dashboard, ${username}!
      Your authentication token is: ${authToken}
      <a href="/dashboard">Go to Dashboard</a>
      <script>
        // Store the authentication token in local storage
        localStorage.setItem('authToken', '${authToken}');
      </script>
    `);
  }

  // If login is unsuccessful, show an error message
  res.send('Invalid login credentials. Please try again.');
});

app.get('/dashboard', (req, res) => {
  // Retrieve the authentication token from local storage
  const clientAuthToken = req.query.authtoken || localStorage.getItem('authToken');

  // Check if the authentication token is present
  if (clientAuthToken) {
    // Find the user data associated with the authentication token in the server's cache
    const userData = cache[clientAuthToken];

    // Check if user data is found and the authToken matches
    if (userData && userData.authToken === clientAuthToken) {
      const { username } = userData;
      // Display a welcome message with the username
      return res.send(`Welcome to the dashboard, ${username}!`);
    }
  }

  // If not authenticated, redirect to login
  return res.redirect('/');
});

app.get('/dash', (req, res) => {
  // Retrieve the authentication token from local storage
  const clientAuthToken = req.query.authtoken || localStorage.getItem('authToken');

  // Check if the authentication token is present
  if (clientAuthToken) {
    // Find the user data associated with the authentication token in the server's cache
    const userData = cache[clientAuthToken];

    // Check if user data is found and the authToken matches
    if (userData && userData.authToken === clientAuthToken) {
      // Send the dashboard.html file as the response
      return res.sendFile('dashboard.html', { root: path.join(__dirname, 'views') });
    }
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
