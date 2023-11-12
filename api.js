const fs = require('fs');

function readUserData() {
  const rawData = fs.readFileSync('data.txt');
  return JSON.parse(rawData);
}

function verifyLogin(user, password) {
  const userData = readUserData();
  const foundUser = userData.find((u) => u.username === user || u.email === user);

  if (foundUser && foundUser.password === password) {
    return {
      success: true,
      message: 'Login successful',
      user: {
        uid: foundUser.uid,
        email: foundUser.email,
        username: foundUser.username,
        lastSession: foundUser.lastSession,
      },
    };
  } else {
    return {
      success: false,
      message: 'Invalid credentials',
    };
  }
}

module.exports = {
  verifyLogin,
};
