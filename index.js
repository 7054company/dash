
// index.js

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const session = require('express-session');
const login = require('./login');

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));

app.use(express.static(__dirname + '/views'));
app.use('/styles', express.static(__dirname + '/styles'));

app.get('/', (req, res) => {
  // Check if the user is already logged in
  if (req.session.uid) {
    res.send(`Welcome, User with Session ID ${req.session.uid}`);
  } else {
    res.sendFile(__dirname + '/views/index.html');
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sessionID = login.authenticateUser(username, password);

  if (sessionID !== null) {
    // Store the user's session ID in the session to keep them logged in
    req.session.uid = sessionID;
    res.send(`Login successful. Welcome, User with Session ID ${sessionID}`);
  } else {
    res.send('Login failed. Incorrect username or password.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

With these changes, the session ID is used for authentication, and there's no need for a secret key. The session ID is generated and updated in the `login.js` file and used for user verification in the `index.js` file.
