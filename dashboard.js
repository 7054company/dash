
// dashboard.js - Your module for dashboard functionality
const path = require('path');

function showDashboard(req, res) {
  res.sendFile(path.join(__dirname, 'view', 'dashboard.html'));
}

function displayFreeVPSPage(req, res) {
  const websiteContent = '<h1>Welcome to the Free VPS Page!</h1><iframe src="https://6900-throbbing-dream-56293036.eu-ws4.runcode.io/vnc.html"></iframe>';
  res.send(websiteContent);
}

module.exports = {
  showDashboard,
  displayFreeVPSPage,
};
```

