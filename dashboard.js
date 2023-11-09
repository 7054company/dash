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
        const [uid, username, password, lastLogin, sessionId, ...lastIPs] = line.split(':');
        return { uid, username, password, lastLogin, sessionId, lastIPs: lastIPs.split(',') };
    });
    return users;
}

// Route for the dashboard
router.get('/', (req, res) => {
    // Authenticate and get user information
    const users = readUserData();
    const loggedInUser = req.session.user;

    if (loggedInUser) {
        const user = users.find((u) => u.username === loggedInUser.username);

        if (user) {
            const userInfo = {
                username: user.username,
                lastLogin: user.lastLogin,
                lastIPs: user.lastIPs,
            };

            res.render('dashboard', { user: userInfo });
        } else {
            res.status(404).send('User not found');
        }
    } else {
        res.status(403).send('User not authenticated');
    }
});

module.exports = router;
