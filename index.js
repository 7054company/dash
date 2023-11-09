// index.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { apiRouter, sessionCache } = require('./api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'views')));
app.use('/api', apiRouter);
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/dashboard/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const user = sessionCache.get(sessionId);

  if (user) {
    res.send(`Welcome to the dashboard, ${user.username}!`);
  } else {
    res.status(401).send('Unauthorized access');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
