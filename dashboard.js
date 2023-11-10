// dashboard.js
const express = require('express');
const router = express.Router();

// Dashboard route
router.get('/', (req, res) => {
  // You might want to retrieve user information from the session or token in a real application
  const username = req.query.username || 'Guest';

  res.status(200).send(`
    <html>
      <head>
        <title>Dashboard</title>
      </head>
      <body>
        <h1>Welcome to the Dashboard, ${username}!</h1>
        <p>This is your personalized dashboard page.</p>
        <a href="/">Back to Welcome Page</a>
      </body>
    </html>
  `);
});

module.exports = router;
