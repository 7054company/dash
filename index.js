const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

const dataFilePath = 'data.txt'; // Path to the data file
let loggedInUser = null; // Keep track of the logged-in user

app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (CSS, images, etc.)
app.use('/styles', express.static(path.join(__dirname, 'styles'));

// Serve the index page as the default page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve HTML pages
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/dashboard', (req, res) => {
    if (loggedInUser) {
        res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
    } else {
        res.send('You need to log in first.');
    }
});

// Handle login
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Read the data from the data.txt file
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const lines = data.split('\n');
    loggedInUser = null;

    // Check if the entered username and password match any in the data.txt file
    for (const line of lines) {
        const [uid, storedUsername, storedPassword, lastLogin, ...lastIPs] = line.split(':');
        if (username === storedUsername && password === storedPassword) {
            loggedInUser = storedUsername;

            // Update the last login timestamp
            const now = new Date();
            const lastLoginDate = now.toISOString();

            // Add the user's current IP address to the list
            const userIP = req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
            lastIPs.push(userIP);

            // Store up to the last 3 IP addresses
            const recentIPs = lastIPs.slice(-3);

            const updatedLine = `${uid}:${storedUsername}:${storedPassword}:${lastLoginDate}:${recentIPs.join(',')}`;

            // Replace the line with the updated data
            const updatedData = lines.map((dataLine) => {
                return dataLine.startsWith(username) ? updatedLine : dataLine;
            }).join('\n');

            fs.writeFileSync(dataFilePath, updatedData, 'utf8');
            break;
        }
    }

    if (loggedInUser) {
        // Successful login, redirect to the dashboard
        res.redirect('/dashboard');
    } else {
        // Invalid credentials, show an error message
        res.send('Invalid username or password. Please try again.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
