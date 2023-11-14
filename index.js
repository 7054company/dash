const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Read user credentials from data.txt
const users = {};
fs.readFileSync('data.txt', 'utf-8').split('\n').forEach(line => {
  const [username, password] = line.trim().split(' ');
  users[username] = password;
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
  if (users[username] && users[username] === password) {
    // Redirect to /dashboard upon successful login
    res.redirect('/dashboard');
  } else {
    res.send('Invalid login credentials. Please try again.');
  }
});

app.get('/dashboard', (req, res) => {
  res.send('Welcome to the dashboard!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
