const API_BASE = '/api/github';

const searchForm = document.getElementById('searchForm');
const queryInput = document.getElementById('q');
const languageInput = document.getElementById('language');
const saveInput = document.getElementById('save');
const loadSavedBtn = document.getElementById('loadSavedBtn');
const messageBox = document.getElementById('messageBox');
const githubResults = document.getElementById('githubResults');
const savedResults = document.getElementById('savedResults');

function mostrarMensaje(texto, tipo = 'info') {
  messageBox.textContent = texto;
  messageBox.className = `message ${tipo}`;
}

function renderRepos(repos, container, mostrarEliminar) {
  container.innerHTML = '';

  if (!Array.isArray(repos) || repos.length === 0) {
    container.innerHTML = '<p class="empty">No hay repositorios para mostrar.</p>';
    return;
  }

  repos.forEach((repo) => {
    const card = document.createElement('article');
    card.className = 'repo-card';

    const language = repo.language || 'No especificado';
    const description = repo.description || 'Sin descripcion';
    const stars = repo.stars ?? 0;
    const forks = repo.forks ?? 0;

    card.innerHTML = `
      <div class="repo-header">
        <h3>${repo.fullName}</h3>
        <span class="badge">${language}</span>
      </div>
      <p>${description}</p>
      <div class="repo-stats">
        <span>Stars: ${stars}</span>
        <span>Forks: ${forks}</span>
      </div>
      <div class="repo-actions"></div>
    `;

    const actions = card.querySelector('.repo-actions');

    const githubLink = document.createElement('a');
    githubLink.href = repo.htmlUrl;
    githubLink.target = '_blank';
    githubLink.rel = 'noopener noreferrer';
    githubLink.textContent = 'Ver en GitHub';
    actions.appendChild(githubLink);

    if (mostrarEliminar && repo._id) {
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'danger';
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.addEventListener('click', () => eliminarRepositorio(repo._id));
      actions.appendChild(deleteBtn);
    }

    container.appendChild(card);
  });
}

async function buscarRepositorios(event) {
  event.preventDefault();

  const q = queryInput.value.trim();
  const language = languageInput.value.trim();
  const save = saveInput.checked;

  if (!q) {
    mostrarMensaje('Debes escribir una palabra clave para buscar.', 'error');
    return;
  }

  mostrarMensaje('Consultando API de GitHub...', 'loading');

  try {
    const params = new URLSearchParams();
    params.set('q', q);
    params.set('save', String(save));

    if (language) {
      params.set('language', language);
    }

    const response = await fetch(`${API_BASE}/search?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.details ? `${data.message}: ${data.details}` : data.message || 'Error al buscar repositorios.');
    }

    renderRepos(data.repos || [], githubResults, false);

    mostrarMensaje(`Busqueda completada. Se obtuvieron ${data.count} repositorios.`, 'success');

    if (save) {
      await cargarGuardados();
    }
  } catch (error) {
    mostrarMensaje(error.message || 'No fue posible completar la busqueda.', 'error');
  }
}

async function cargarGuardados() {
  try {
    const response = await fetch(`${API_BASE}/saved`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al cargar repositorios guardados.');
    }

    renderRepos(data.repos || [], savedResults, true);
  } catch (error) {
    mostrarMensaje(error.message || 'No fue posible cargar los repositorios guardados.', 'error');
  }
}

async function eliminarRepositorio(id) {
  const confirmar = window.confirm('Estas seguro de eliminar este repositorio guardado?');

  if (!confirmar) {
    return;
  }

  mostrarMensaje('Eliminando repositorio guardado...', 'loading');

  try {
    const response = await fetch(`${API_BASE}/saved/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'No se pudo eliminar el repositorio.');
    }

    mostrarMensaje('Repositorio eliminado correctamente.', 'success');
    await cargarGuardados();
  } catch (error) {
    mostrarMensaje(error.message || 'Ocurrio un error al eliminar el repositorio.', 'error');
  }
}

searchForm.addEventListener('submit', buscarRepositorios);
loadSavedBtn.addEventListener('click', cargarGuardados);
cargarGuardados();
