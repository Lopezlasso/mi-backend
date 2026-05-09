const { Router } = require('express');
const {
  searchGitHubRepos,
  getSavedRepos,
  getSavedRepoById,
  saveRepo,
  updateSavedRepo,
  deleteSavedRepo
} = require('../controllers/github.controllers');

const router = Router();

router.get('/search', searchGitHubRepos);
router.get('/saved', getSavedRepos);
router.get('/saved/:id', getSavedRepoById);
router.post('/saved', saveRepo);
router.put('/saved/:id', updateSavedRepo);
router.delete('/saved/:id', deleteSavedRepo);

module.exports = router;