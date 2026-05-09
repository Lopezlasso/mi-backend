const { Router } = require('express');
const githubRoutes = require('./github.routes');

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GitHub API backend funcionando'
  });
});

router.use('/api/github', githubRoutes);

module.exports = router;