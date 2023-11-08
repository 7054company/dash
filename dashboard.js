const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    // You can implement your authentication logic here
    if (/* Check if the user is authenticated */) {
        next();
    } else {
        res.redirect('/login'); // Redirect to the login page if not authenticated
    }
};

// Set the path to your data.txt file
const dataFilePath = path.join(__dirname, 'data.txt');

// Function to read user data from data.txt
function readUserData() {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const lines = data.split('\n');
    const users = lines.map((line) => {
        const [uid, username, password, lastLogin, lastIPs] = line.split(':');
        return { uid, username, password, lastLogin, lastIPs: lastIPs.split(',') };
    });
    return users;
}

// Route for the personal section
router.get('/personal', isAuthenticated, (req, res) => {
    // Authenticate and get user information
    const users = readUserData();
    const user = users.find((u) => u.username === req.user.username);

    if (user) {
        res.render('personal', { user });
    } else {
        res.status(404).send('User not found');
    }
});

// Route to handle password updates
router.post('/update-password', isAuthenticated, (req, res) => {
    // Handle password update logic
    // You can validate, update, and store the new password here
});

module.exports = router;
