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

async function getNextUid() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const users = data.split('\n').map(line => {
      const [uid] = line.split(' ');
      return parseInt(uid);
    });

    const nextUid = users.length + 1;
    return nextUid;
  } catch (error) {
    console.error(error);
    throw new Error('Error generating UID');
  }
}

apiRouter.get('/login/:username/:password', async (req, res) => {
  try {
    const { username, password } = req.params;

    // Read user data from the data.txt file
    const data = await fs.readFile(dataFilePath, 'utf-8');
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

      res.json({ success: true, message: 'Login successful', user, sessionId });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

apiRouter.get('/signup/:username/:password', async (req, res) => {
  try {
    const { username, password } = req.params;

    // Read user data from the data.txt file
    let data = await fs.readFile(dataFilePath, 'utf-8');
    const users = data.split('\n').map(line => {
      const [uid, u, p, sessionId] = line.split(' ');
      return { uid, username: u, password: p, sessionId };
    });

    // Check if the username is already taken
    if (users.some(u => u.username === username)) {
      res.status(400).json({ success: false, message: 'Username already exists' });
      return;
    }

    // Generate a sequential user ID
    const uid = await getNextUid();

    // Create a new user
    const newUser = {
      uid,
      username,
      password,
      sessionId: generateSessionId(),
    };

    // Add the new user to the users array
    users.push(newUser);

    // Save the updated user data in the data.txt file
    data += `\n${newUser.uid} ${newUser.username} ${newUser.password} ${newUser.sessionId}`;
    await fs.writeFile(dataFilePath, data);

    // Store the session ID in the session cache
    sessionCache.set(newUser.sessionId, newUser);

    res.json({ success: true, message: 'Signup successful', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

apiRouter.get('/data', async (req, res) => {
  try {
    // Read user data from the data.txt file
    const data = await fs.readFile(dataFilePath, 'utf-8');
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = { apiRouter, sessionCache };
