const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const apiRouter = require('./dashboard'); // assuming both files are in the same directory

const app = express();
const port = 3000;

const dataFilePath = 'data.txt'; // Path to the data file
let loggedInUser = null; // Keep track of the logged-in user

app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (CSS, images, etc.)
app.use('/styles', express.static('styles'));

// Use the apiRouter
app.use('/dashboard', dashboardRouter);

// Serve the index page as the default page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// ... (other routes)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
