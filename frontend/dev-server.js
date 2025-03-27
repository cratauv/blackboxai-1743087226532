const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the src directory
app.use(express.static(path.join(__dirname, 'src')));

// For all other routes, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});