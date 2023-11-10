const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the root page
app.get('/', (req, res) => {
  res.send('Get started');
});

// Route for the dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'dashboard.html'));
});

// Route for displaying the free VPS page with iframe
app.get('/dashboard/free-vps', (req, res) => {
  const websiteURL = 'https://6900-throbbing-dream-56293036.eu-ws3.runcode.io/vnc.html';
  res.send(`
    <html>
      <head>
        <title>Free VPS</title>
      </head>
      <body>
        <h1>Welcome to Free VPS</h1>
        <iframe src="${websiteURL}" width="100%" height="600"></iframe>
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```
