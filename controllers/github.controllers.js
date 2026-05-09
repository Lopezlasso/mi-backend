import mongoose from 'mongoose';
import GitHubRepo from '../models/githubRepo.model.js';

const transformarRepositorio = (repo, searchTerm) => ({
  githubId: repo.id,
  name: repo.name,
  fullName: repo.full_name,
  description: repo.description || '',
  htmlUrl: repo.html_url,
  cloneUrl: repo.clone_url || '',
  ownerLogin: repo.owner?.login || 'desconocido',
  ownerAvatarUrl: repo.owner?.avatar_url || '',
  language: repo.language || 'No especificado',
  stars: repo.stargazers_count || 0,
  forks: repo.forks_count || 0,
  openIssues: repo.open_issues_count || 0,
  defaultBranch: repo.default_branch || '',
  createdAtGithub: repo.created_at ? new Date(repo.created_at) : null,
  updatedAtGithub: repo.updated_at ? new Date(repo.updated_at) : null,
  lastFetchedAt: new Date(),
  searchTerm
});

export const searchGitHubRepos = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const language = (req.query.language || '').trim();
    const saveValue = req.query.save;

    if (!q) {
      return res.status(400).json({
        message: 'El parametro q es obligatorio'
      });
    }

    const shouldSave = saveValue === undefined ? true : String(saveValue).toLowerCase() !== 'false';

    const rawPerPage = Number.parseInt(process.env.GITHUB_PER_PAGE || '10', 10);
    const normalizedPerPage = Number.isNaN(rawPerPage) ? 10 : rawPerPage;
    const perPage = String(Math.min(30, Math.max(1, normalizedPerPage)));

    const githubQuery = language ? `${q} language:${language.trim()}` : q;

    const baseUrl = process.env.GITHUB_API_BASE_URL || 'https://api.github.com';
    const url = new URL('/search/repositories', baseUrl);

    url.searchParams.set('q', githubQuery);
    url.searchParams.set('sort', 'stars');
    url.searchParams.set('order', 'desc');
    url.searchParams.set('per_page', perPage);

    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'mi-backend-university-project'
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(url, { headers });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        message: 'Error al consultar la API de GitHub',
        status: response.status,
        details: data?.message || null
      });
    }

    const reposTransformados = Array.isArray(data.items)
      ? data.items.map((repo) => transformarRepositorio(repo, q))
      : [];

    let reposFinales = reposTransformados;

    if (shouldSave && reposTransformados.length > 0) {
      reposFinales = await Promise.all(
        reposTransformados.map((repo) =>
          GitHubRepo.findOneAndUpdate(
            { githubId: repo.githubId },
            { $set: repo },
            {
              upsert: true,
              returnDocument: 'after',
              runValidators: true,
              setDefaultsOnInsert: true
            }
          ).select('-__v')
        )
      );
    }

    return res.status(200).json({
      message: 'Repositorios obtenidos correctamente',
      query: q,
      language: language || null,
      saved: shouldSave,
      totalGitHubResults: data.total_count || 0,
      count: reposFinales.length,
      repos: reposFinales
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error interno al buscar repositorios',
      details: error.message
    });
  }
};

export const getSavedRepos = async (req, res) => {
  try {
    const language = (req.query.language || '').trim();
    const q = (req.query.q || '').trim();

    const rawLimit = Number.parseInt(req.query.limit || '20', 10);
    const normalizedLimit = Number.isNaN(rawLimit) ? 20 : rawLimit;
    const limit = Math.min(50, Math.max(1, normalizedLimit));

    const filters = {};

    if (language) {
      filters.language = { $regex: language, $options: 'i' };
    }

    if (q) {
      filters.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { searchTerm: { $regex: q, $options: 'i' } }
      ];
    }

    const repos = await GitHubRepo.find(filters)
      .sort({ stars: -1 })
      .limit(limit)
      .select('-__v');

    return res.status(200).json({
      message: 'Repositorios guardados obtenidos correctamente',
      count: repos.length,
      repos
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener repositorios guardados',
      details: error.message
    });
  }
};

export const getSavedRepoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'El id proporcionado no es valido'
      });
    }

    const repo = await GitHubRepo.findById(id).select('-__v');

    if (!repo) {
      return res.status(404).json({
        message: 'Repositorio no encontrado'
      });
    }

    return res.status(200).json({
      message: 'Repositorio guardado obtenido correctamente',
      repo
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el repositorio guardado',
      details: error.message
    });
  }
};

export const deleteSavedRepo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'El id proporcionado no es valido'
      });
    }

    const repoEliminado = await GitHubRepo.findByIdAndDelete(id).select('-__v');

    if (!repoEliminado) {
      return res.status(404).json({
        message: 'Repositorio no encontrado'
      });
    }

    return res.status(200).json({
      message: 'Repositorio eliminado correctamente',
      repo: repoEliminado
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar repositorio guardado',
      details: error.message
    });
  }
};
