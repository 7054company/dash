const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Placeholder for in-memory user data (replace with your database logic)
const users = [];

// Middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
  const loggedInUser = req.cookies.loggedInUser;
  const sessionId = req.cookies.sessionId;

  if (loggedInUser && sessionId) {
    const user = users.find(u => u.username === loggedInUser.username && u.sessionId === sessionId);
    if (user) {
      req.currentUser = user; // Attach the user data to the request
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// API endpoint to get the current logged-in user data
router.get('/user', isAuthenticated, async (req, res) => {
  try {
    // Access the current user data from the request
    const { username, sessionId } = req.currentUser;

    // Read the data.txt file content
    const filePath = path.join(__dirname, 'data.txt');
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Find the user's data in the file content
    const userDataRegex = new RegExp(`^${username} ${sessionId}$`, 'm');
    const userDataMatch = fileContent.match(userDataRegex);

    if (userDataMatch) {
      res.json({
        username,
        sessionId,
        // Add other user properties as needed
      });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error reading data.txt:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login endpoint (accepts any HTTP method)
router.route('/login/:username/:password')
  .all((req, res) => {
    // Handle any HTTP method here
    const { method } = req;

    switch (method) {
      case 'GET':
        res.json({ message: 'Please use POST method for login' });
        break;
      case 'POST':
        const { username, password } = req.params;

        // Placeholder: Replace with actual authentication logic
        const user = authenticateUser(username, password);

        if (user) {
          // Generate a session ID (placeholder: replace with a secure session management solution)
          const sessionId = generateSessionId();

          // Save the session ID in the user object
          user.sessionId = sessionId;

          // Save the user object in the in-memory storage
          users.push(user);

          // Append the user's data to the data.txt file
          const userDataLine = `${username} ${sessionId}\n`;
          const filePath = path.join(__dirname, 'data.txt');
          fs.appendFile(filePath, userDataLine);

          res.json({
            success: true,
            user: { username: user.username },
            sessionId,
          });
        } else {
          res.json({ success: false, message: 'Invalid credentials' });
        }
        break;
      default:
        res.status(405).json({ message: 'Method Not Allowed' });
    }
  });

// Signup endpoint (accepts any HTTP method)
router.route('/signup/:username/:password')
  .all((req, res) => {
    // Handle any HTTP method here
    const { method } = req;

    switch (method) {
      case 'GET':
        res.json({ message: 'Please use POST method for signup' });
        break;
      case 'POST':
        const { username, password } = req.params;

        // Placeholder: Replace with actual user creation logic
        const userExists = users.some(user => user.username === username);

        if (!userExists) {
          const newUser = { username, password };
          users.push(newUser);

          res.json({
            success: true,
            user: { username: newUser.username },
          });
        } else {
          res.json({ success: false, message: 'Username already exists' });
        }
        break;
      default:
        res.status(405).json({ message: 'Method Not Allowed' });
    }
  });

// Placeholder for session management logic
function generateSessionId() {
  // Placeholder: Replace with a secure method to generate a session ID
  return Math.random().toString(36).substring(7);
}

// Placeholder for authentication logic
function authenticateUser(username, password) {
  // Placeholder: Replace with actual authentication logic (e.g., database query)
  return users.find(user => user.username === username && user.password === password);
}

module.exports = router;
