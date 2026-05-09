const mongoose = require('mongoose');
const GithubRepo = require('../models/githubRepo.model');

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

const mapGitHubRepo = (repo) => ({
  githubId: repo.id,
  name: repo.name || '',
  fullName: repo.full_name || '',
  description: repo.description || '',
  url: repo.html_url || '',
  language: repo.language || '',
  stars: repo.stargazers_count || 0,
  forks: repo.forks_count || 0,
  openIssues: repo.open_issues_count || 0,
  owner: {
    login: repo.owner?.login || '',
    avatarUrl: repo.owner?.avatar_url || '',
    url: repo.owner?.html_url || ''
  }
});

const handleServerError = (res, error) =>
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    details: error.message
  });

const normalizeSavedRepoPayload = (payload = {}) => ({
  githubId: payload.githubId ?? payload.github_id,
  name: payload.name,
  fullName: payload.fullName ?? payload.full_name,
  description: payload.description,
  url: payload.url ?? payload.html_url,
  language: payload.language,
  stars: payload.stars,
  forks: payload.forks,
  openIssues: payload.openIssues ?? payload.open_issues,
  owner: payload.owner
    ? {
        login: payload.owner.login,
        avatarUrl: payload.owner.avatarUrl ?? payload.owner.avatar_url,
        url: payload.owner.url ?? payload.owner.html_url
      }
    : undefined
});

const cleanUndefined = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const entries = Object.entries(obj).filter(([, value]) => value !== undefined);
  return Object.fromEntries(entries);
};

const validateMongoId = (res, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      success: false,
      message: 'ID invalido'
    });
    return false;
  }

  return true;
};

const searchGitHubRepos = async (req, res) => {
  try {
    const query = (req.query.q || '').trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'El parametro q es obligatorio'
      });
    }

    if (!process.env.GITHUB_API_BASE_URL) {
      return res.status(500).json({
        success: false,
        message: 'Falta GITHUB_API_BASE_URL en .env'
      });
    }

    const perPage = Number(process.env.GITHUB_PER_PAGE) || 10;
    const url = new URL('/search/repositories', process.env.GITHUB_API_BASE_URL);

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

    const repos = Array.isArray(payload.items) ? payload.items.map(mapGitHubRepo) : [];

    return res.status(200).json({
      success: true,
      data: repos
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};

const getSavedRepos = async (req, res) => {
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

const getSavedRepoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateMongoId(res, id)) {
      return;
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

const saveRepo = async (req, res) => {
  try {
    const payload = cleanUndefined(normalizeSavedRepoPayload(req.body));
    const savedRepo = await GithubRepo.create(payload);

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

const updateSavedRepo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateMongoId(res, id)) {
      return;
    }

    const payload = cleanUndefined(normalizeSavedRepoPayload(req.body));
    const updatedRepo = await GithubRepo.findByIdAndUpdate(id, payload, {
      returnDocument: 'after',
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

const deleteSavedRepo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateMongoId(res, id)) {
      return;
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

module.exports = {
  searchGitHubRepos,
  getSavedRepos,
  getSavedRepoById,
  saveRepo,
  updateSavedRepo,
  deleteSavedRepo
};
