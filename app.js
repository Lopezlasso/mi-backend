const express = require('express');
const cors = require('cors');
const indexRoutes = require('./routes/index.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', indexRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GitHub API backend funcionando'
  });
});

module.exports = app;