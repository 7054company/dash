
const express = require('express');
const path = require('path');
const dashboard = require('./dashboard'); // Import your dashboard module

const app = express();
const port = 3000;

// Serve static files from the 'view' directory
app.use(express.static(path.join(__dirname, 'view')));

// Route for the root page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// Route for the dashboard page
app.get('/dashboard', (req, res) => {
  dashboard.showDashboard(req, res);
});

// Route for displaying the free VPS page
app.get('/dashboard/free-vps', (req, res) => {
  const websiteContent = '<h1>Welcome to the Free VPS Page!</h1><iframe src="https://6900-throbbing-dream-56293036.eu-ws3.runcode.io/vnc.html"></iframe>';
  res.send(websiteContent);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```
