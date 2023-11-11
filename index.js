const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the 'views' directory
app.use(express.static(__dirname + '/views'));

// Route for the root page
app.get('/', (req, res) => {
  res.send('Get started');
});

// Route for the dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/views/dashboard.html');
});

// Route for displaying the free VPS page with iframe
app.get('/f', (req, res) => {
  const websiteURL = 'https://6080-throbbing-dream-56293036.eu-ws4.runcode.io/vnc.html';
  res.send(`
    <html>
      <head>
        <title>Free VPS</title>
      </head>
      <body>
        <h1>Welcome to Free VPS - 7ea</h1>
        <iframe src="${websiteURL}" width="100%" height="800"></iframe>
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
