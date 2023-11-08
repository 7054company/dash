const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const dashboard = require('./dashboard'); // Import the dashboard module

// Middleware for parsing form data
app.use(express.urlencoded({ extended: false }));

// Serve static files (CSS, images, etc.)
app.use('/styles', express.static('styles'));

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

// Route for the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
    // Authenticate the user
    const username = req.body.username;
    const password = req.body.password;

    const users = readUserData();
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
        // Successful login, update the last login timestamp, IP, and redirect to the dashboard
        const now = new Date();
        user.lastLogin = now.toISOString();
        const userIP = req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        user.lastIPs.push(userIP);

        // Store the updated data in data.txt (update your data.txt accordingly)
        const updatedData = users.map((u) => `${u.uid}:${u.username}:${u.password}:${u.lastLogin}:${u.lastIPs.join(',')}`).join('\n');
        fs.writeFileSync(dataFilePath, updatedData, 'utf8');

        res.redirect('/dashboard');
    } else {
        // Invalid credentials, show an error message or stay on the login page
        res.send('Invalid username or password. Please try again.');
    }
});

// Include the dashboard routes
app.use('/dashboard', dashboard);

// Route to serve the index.html page at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
