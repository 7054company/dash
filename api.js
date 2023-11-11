// api.js

const fs = require('fs');
const jwt = require('jsonwebtoken');

const secretKey = '12345'; // Replace with your own secret key

function readUserData() {
  const rawData = fs.readFileSync('data.txt');
  return JSON.parse(rawData);
}

function generateToken(user) {
  return jwt.sign({ user }, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
}

function verifyLogin(userData, user, password) {
  const foundUser = userData.find((u) => u.username === user || u.email === user);

  if (foundUser && foundUser.password === password) {
    const token = generateToken({
      uid: foundUser.uid,
      email: foundUser.email,
      username: foundUser.username,
    });

    return {
      success: true,
      message: 'Login successful',
      user: {
        uid: foundUser.uid,
        email: foundUser.email,
        username: foundUser.username,
        lastSession: foundUser.lastSession,
        token,
      },
    };
  } else {
    return {
      success: false,
      message: 'Invalid credentials',
    };
  }
}

function decodeToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
}

function getUserDetails(token) {
  const decodedToken = decodeToken(token);

  if (!decodedToken) {
    return { success: false, message: 'Unauthorized: Invalid token' };
  }

  // Assuming decodedToken.user contains user details (uid, email, username)
  const { uid, email, username } = decodedToken.user;
  const userWithoutPassword = { uid, email, username, lastSession: new Date() }; // Exclude password

  return { success: true, user: userWithoutPassword };
}

module.exports = {
  verifyLogin,
  getUserDetails,
};
