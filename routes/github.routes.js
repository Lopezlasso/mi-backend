import { Router } from 'express';
import {
  searchGithubRepos,
  getSavedRepos,
  getSavedRepoById,
  saveRepo,
  updateSavedRepo,
  deleteSavedRepo
} from '../controllers/github.controllers.js';

const router = Router();

router.get('/search', searchGithubRepos);
router.get('/saved', getSavedRepos);
router.get('/saved/:id', getSavedRepoById);
router.post('/saved', saveRepo);
router.put('/saved/:id', updateSavedRepo);
router.delete('/saved/:id', deleteSavedRepo);

export default router;