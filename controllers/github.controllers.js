import mongoose from 'mongoose';
import GithubRepo from '../models/githubRepo.model.js';

const buildGitHubHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'mi-backend-university-project'
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
};

const mapGithubRepo = (repo) => ({
  github_id: repo.id,
  name: repo.name || '',
  full_name: repo.full_name || '',
  html_url: repo.html_url || '',
  description: repo.description || '',
  language: repo.language || '',
  stars: repo.stargazers_count || 0,
  forks: repo.forks_count || 0,
  open_issues: repo.open_issues_count || 0,
  owner: {
    login: repo.owner?.login || '',
    avatar_url: repo.owner?.avatar_url || '',
    html_url: repo.owner?.html_url || ''
  }
});

const handleServerError = (res, error) =>
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    details: error.message
  });

export const searchGithubRepos = async (req, res) => {
  try {
    const query = (req.query.q || '').trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'El parametro q es obligatorio'
      });
    }

    const baseUrl = process.env.GITHUB_API_BASE_URL || 'https://api.github.com';
    const perPage = Number(process.env.GITHUB_PER_PAGE) || 10;
    const url = new URL('/search/repositories', baseUrl);

    url.searchParams.set('q', query);
    url.searchParams.set('sort', 'stars');
    url.searchParams.set('order', 'desc');
    url.searchParams.set('per_page', String(perPage));

    const response = await fetch(url, {
      headers: buildGitHubHeaders()
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: 'Error al consultar la API de GitHub',
        details: payload?.message || null
      });
    }

    const repos = Array.isArray(payload.items) ? payload.items.map(mapGithubRepo) : [];

    return res.status(200).json({
      success: true,
      data: repos
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};

export const getSavedRepos = async (req, res) => {
  try {
    const repos = await GithubRepo.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: repos
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};

export const getSavedRepoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalido'
      });
    }

    const repo = await GithubRepo.findById(id);

    if (!repo) {
      return res.status(404).json({
        success: false,
        message: 'Repositorio no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      data: repo
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};

export const saveRepo = async (req, res) => {
  try {
    const savedRepo = await GithubRepo.create(req.body);

    return res.status(201).json({
      success: true,
      data: savedRepo
    });
  } catch (error) {
    if (error?.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos invalidos para guardar el repositorio',
        details: error.message
      });
    }

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'El repositorio ya existe en la base de datos',
        details: error.message
      });
    }

    return handleServerError(res, error);
  }
};

export const updateSavedRepo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalido'
      });
    }

    const updatedRepo = await GithubRepo.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedRepo) {
      return res.status(404).json({
        success: false,
        message: 'Repositorio no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedRepo
    });
  } catch (error) {
    if (error?.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos invalidos para actualizar el repositorio',
        details: error.message
      });
    }

    return handleServerError(res, error);
  }
};

export const deleteSavedRepo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalido'
      });
    }

    const deletedRepo = await GithubRepo.findByIdAndDelete(id);

    if (!deletedRepo) {
      return res.status(404).json({
        success: false,
        message: 'Repositorio no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Repositorio eliminado correctamente',
      data: deletedRepo
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};