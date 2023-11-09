// api.js
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const apiRouter = express.Router();

const dataFilePath = path.join(__dirname, 'data.txt');
const sessionCache = new Map();

function generateSessionId() {
  return crypto.randomBytes(16).toString('hex');
}

apiRouter.get('/login/:username/:password', async (req, res) => {
  try {
    const { username, password } = req.params;

    // Read user data from the data.txt file
    let data = await fs.readFile(dataFilePath, 'utf-8');
    const users = data.split('\n').map(line => {
      const [uid, u, p, sessionId] = line.split(' ');
      return { uid, username: u, password: p, sessionId };
    });

    // Check if the provided username and password match any user
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      // Generate a unique session ID
      const sessionId = generateSessionId();

      // Store the session ID in the session cache
      sessionCache.set(sessionId, user);

      // Save the session ID in the data.txt file
      data += `\n${user.uid} ${user.username} ${user.password} ${sessionId}`;
      await fs.writeFile(dataFilePath, data);

      res.json({ success: true, message: 'Login successful', user, sessionId });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = { apiRouter, sessionCache };
