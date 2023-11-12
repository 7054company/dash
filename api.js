// apiModule.js

const fs = require('fs');
const crypto = require('crypto');
const NodeCache = require('node-cache');

const cache = new NodeCache();

function loginUser(username, password) {
  // Read the content of data.txt
  const dataContent = fs.readFileSync('data.txt', 'utf-8');
  const lines = dataContent.split('\n');

  // Find the user in data.txt
  const user = lines.find(line => {
    const [uid, userUsername, userPassword] = line.split(' ');
    return userUsername === username && userPassword === password;
  });

  if (user) {
    // Generate a session ID (you might want to use a more secure method)
    const sessionId = crypto.randomBytes(16).toString('hex');

    // Save the session ID in cache
    cache.set(sessionId, { username, uid: user.split(' ')[0] });

    return { success: true, sessionId };
  } else {
    return { success: false, message: 'Invalid username or password' };
  }
}

module.exports = {
  loginUser,
};
