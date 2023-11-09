const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.user) {
        // User is authenticated, continue
        next();
    } else {
        // User is not authenticated, but still allow access to /dashboard/user-info
        next();
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
        return { uid, username, lastLogin, lastIPs: lastIPs.split(',') };
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

// API endpoint to fetch user info (username, IP, timestamp)
router.get('/user-info', isAuthenticated, (req, res) => {
    const users = readUserData();
    const user = users.find((u) => u.username === req.user.username);

    if (user) {
        const userInfo = {
            username: user.username,
            lastLogin: user.lastLogin,
            lastIPs: user.lastIPs,
        };

        res.json(userInfo);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;
