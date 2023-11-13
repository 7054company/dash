
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a route handler for the login path
app.post('/login', (req, res) => {
  // Get username and password from the request body
  const { username, password } = req.body;

  // Read user data from the "data.txt" file
  fs.readFile('data.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    // Parse the data as JSON
    const userData = JSON.parse(data);

    // Verify username and password
    if (userData.username === username && userData.password === password) {
      res.send('Login successful!');
    } else {
      res.status(401).send('Unauthorized: Invalid username or password');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
