const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

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

// API endpoint to fetch user info (username, IP, timestamp) of the current logged-in user
router.get('/user-info', (req, res) => {
    if (req.session && req.session.user) {
        // If user is logged in, fetch user data from session
        const username = req.session.user.username;
        const users = readUserData();
        const user = users.find((u) => u.username === username);

        if (user) {
            const userInfo = {
                username: user.username,
                lastLogin: user.lastLogin,
                lastIPs: user.lastIPs,
            };

            res.json(userInfo);
        } else {
            res.status(404).json({ message: 'User not found in data.txt' });
        }
    } else {
        // User is not authenticated, return an error or redirect as needed
        res.status(403).json({ message: 'User not authenticated' });
    }
});

module.exports = router;
