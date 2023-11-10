// dashboard.js
const getWelcomeMessage = (username, ip) => {
  return `Welcome, ${username}! Your current IP address is ${ip}.`;
};

module.exports = {
  getWelcomeMessage,
};
