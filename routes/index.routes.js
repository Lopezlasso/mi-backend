import { Router } from 'express';
import githubRoutes from './github.routes.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API principal funcionando correctamente',
    endpoints: {
      githubSearch: '/api/github/search?q=node',
      githubSaved: '/api/github/saved'
    }
  });
});

router.use('/github', githubRoutes);

export default router;
