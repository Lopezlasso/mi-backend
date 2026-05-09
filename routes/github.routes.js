import { Router } from 'express';
import {
  searchGitHubRepos,
  getSavedRepos,
  getSavedRepoById,
  deleteSavedRepo
} from '../controllers/github.controllers.js';

const router = Router();

router.get('/search', searchGitHubRepos);
router.get('/saved', getSavedRepos);
router.get('/saved/:id', getSavedRepoById);
router.delete('/saved/:id', deleteSavedRepo);

export default router;
