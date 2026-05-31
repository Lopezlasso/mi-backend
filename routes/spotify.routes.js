import { Router } from 'express';
import {
  crearSpotify,
  obtenerSpotify,
  obtenerSpotifyPorId,
  actualizarSpotify,
  eliminarSpotify
} from '../controllers/spotify.controllers.js';

const router = Router();

router.post('/', crearSpotify);
router.get('/', obtenerSpotify);
router.get('/:id', obtenerSpotifyPorId);
router.put('/:id', actualizarSpotify);
router.delete('/:id', eliminarSpotify);

export default router;
