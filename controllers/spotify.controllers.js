import mongoose from 'mongoose';
import SpotifyPlaylist from '../models/spotify.model.js';

const formatearErroresValidacion = (error) =>
  Object.values(error.errors).map((err) => err.message);

const obtenerSpotify = async (req, res) => {
  try {
    const registros = await SpotifyPlaylist.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: registros.length,
      data: registros
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las playlists de Spotify'
    });
  }
};

const obtenerSpotifyPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalido'
      });
    }

    const registro = await SpotifyPlaylist.findById(id);

    if (!registro) {
      return res.status(404).json({
        success: false,
        message: 'Playlist de Spotify no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      data: registro
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la playlist de Spotify'
    });
  }
};

const crearSpotify = async (req, res) => {
  try {
    const nuevoRegistro = await SpotifyPlaylist.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Playlist de Spotify creada correctamente',
      data: nuevoRegistro
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validacion',
        errors: formatearErroresValidacion(error)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al crear la playlist de Spotify'
    });
  }
};

const actualizarSpotify = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalido'
      });
    }

    const registroActualizado = await SpotifyPlaylist.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!registroActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Playlist de Spotify no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Playlist de Spotify actualizada correctamente',
      data: registroActualizado
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validacion',
        errors: formatearErroresValidacion(error)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la playlist de Spotify'
    });
  }
};

const eliminarSpotify = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalido'
      });
    }

    const registroEliminado = await SpotifyPlaylist.findByIdAndDelete(id);

    if (!registroEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Playlist de Spotify no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Playlist de Spotify eliminada correctamente',
      data: registroEliminado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la playlist de Spotify'
    });
  }
};

export {
  crearSpotify,
  obtenerSpotify,
  obtenerSpotifyPorId,
  actualizarSpotify,
  eliminarSpotify
};
