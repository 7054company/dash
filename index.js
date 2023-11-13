
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define a route for /login
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
      res.send('Login successful!');
    } else {
      res.status(401).send('Invalid username or password');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
