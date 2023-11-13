// index.js

const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views')); // Assume dashboard.html is in a "public" directory

app.get('/', (req, res) => {
  res.send('Welcome to the Application!');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Read user and password data from data.txt
  const data = fs.readFileSync('data.txt', 'utf8');
  const [savedUsername, savedPassword] = data.split(',');

  // Verify the credentials
  if (username === savedUsername && password === savedPassword) {
    res.redirect('/dashboard');
  } else {
    res.send('Invalid credentials. Please try again.');
  }
});

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/views/dashboard.html');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
