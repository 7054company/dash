const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the root folder
app.use(express.static(__dirname));

// Define the route for the welcome page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'welcome.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
