// index.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const loginRouter = require('./login');
const dashboardRouter = require('./dashboard'); // Add this line

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Serve static files from the root folder
app.use(express.static(__dirname));

// Define the route for the welcome page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'welcome.html'));
});

// Use the loginRouter for the /login route
app.use('/login', loginRouter);

// Use the dashboardRouter for the /dashboard route
app.use('/dashboard', dashboardRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
