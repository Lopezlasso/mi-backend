import mongoose from 'mongoose';

const spotifyPlaylistSchema = new mongoose.Schema(
  {
    nombrePlaylist: {
      type: String,
      required: [true, 'El nombre de la playlist es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres']
    },
    categoria: {
      type: String,
      required: [true, 'La categoria es obligatoria'],
      trim: true
    },
    generoPrincipal: {
      type: String,
      required: [true, 'El genero principal es obligatorio'],
      trim: true
    },
    descripcion: {
      type: String,
      required: [true, 'La descripcion es obligatoria'],
      trim: true,
      minlength: [10, 'La descripcion debe tener al menos 10 caracteres']
    },
    cantidadCanciones: {
      type: Number,
      required: [true, 'La cantidad de canciones es obligatoria'],
      min: [1, 'La playlist debe tener al menos una cancion']
    },
    duracionMinutos: {
      type: Number,
      required: [true, 'La duracion en minutos es obligatoria'],
      min: [1, 'La duracion no puede ser menor a 1 minuto']
    },
    seguidores: {
      type: Number,
      required: [true, 'La cantidad de seguidores es obligatoria'],
      min: [0, 'Los seguidores no pueden ser negativos']
    },
    estado: {
      type: String,
      enum: ['activa', 'pausada', 'archivada'],
      default: 'activa'
    },
    enlaceSpotify: {
      type: String,
      required: [true, 'El enlace de Spotify es obligatorio'],
      trim: true
    },
    esPublica: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const SpotifyPlaylist = mongoose.model('SpotifyPlaylist', spotifyPlaylistSchema);

export default SpotifyPlaylist;
