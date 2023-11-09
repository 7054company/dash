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

// API endpoint to fetch user info (username, IP, timestamp) using the currently logged-in user
router.get('/user-info', (req, res) => {
    if (req.session && req.session.user) {
        const loggedInUsername = req.session.user.username;
        const users = readUserData();
        const user = users.find((u) => u.username === loggedInUsername);

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
        res.status(403).json({ message: 'User not authenticated' });
    }
});

module.exports = router;
