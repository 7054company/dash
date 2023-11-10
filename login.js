const fs = require('fs');

const usersDataPath = 'data.txt';

function loadUserData() {
  const data = fs.readFileSync(usersDataPath, 'utf-8');
  return JSON.parse(data);
}

function saveUserData(data) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(usersDataPath, jsonData, 'utf-8');
}

function handleLogin(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Both username and password are required.' });
  }

  const userData = loadUserData();
  const user = userData.find(u => u.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  // Redirect to the /dashboard route with the welcome message and IP address
  res.redirect(`/dashboard?username=${username}&ip=${req.clientIP}`);
}

module.exports = {
  loadUserData,
  saveUserData,
  handleLogin,
};
