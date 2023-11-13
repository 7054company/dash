
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Define a route for /
app.get('/', (req, res) => {
  res.send('Welcome to the start! <a href="/login">Login</a>');
});

// Define a route for /login
app.get('/login', (req, res) => {
  const loginPath = path.join(__dirname, 'views', 'login.html');
  res.sendFile(loginPath);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Read user and password data from data.txt
  fs.readFile('data.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Parse the data from data.txt (assuming JSON format for simplicity)
    const userData = JSON.parse(data);

    // Check if the provided username and password match
    if (username === userData.username && password === userData.password) {
      // Redirect the logged-in user to /dashboard
      res.redirect('/dashboard');
    } else {
      res.status(401).send('Invalid username or password');
    }
  });
});

// Define a route for /dashboard
app.get('/dashboard', (req, res) => {
  const dashboardPath = path.join(__dirname, 'views', 'dashboard.html');
  res.sendFile(dashboardPath);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
