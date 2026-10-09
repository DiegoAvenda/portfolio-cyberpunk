import '@fontsource/share-tech-mono/400.css'
import './style.css'
import { projects } from './data/projects.js'

// Estilos de badge por color. Strings completos para que Tailwind v4
// los detecte en el escaneo (no armarlos con template strings).
const TECH_STYLES = {
  yellow: 'border-cyber-yellow text-cyber-yellow bg-cyber-yellow/10',
  cyan: 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10',
  magenta: 'border-cyber-magenta text-cyber-magenta bg-cyber-magenta/10',
}

// Variantes de acento por proyecto. Las clases están en literales
// para que Tailwind v4 las detecte en el escaneo de contenido.
const ACCENTS = {
  cyan: {
    status: 'text-cyber-cyan',
    cardHover: 'hover:border-cyber-cyan',
    imageHover: 'group-hover:border-cyber-cyan',
    placeholderHover: 'group-hover:text-cyber-cyan',
    titleHover: 'group-hover:text-cyber-cyan',
    button:
      'border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black hover:shadow-neon-cyan',
    corner: 'border-cyber-cyan',
  },
  magenta: {
    status: 'text-cyber-magenta',
    cardHover: 'hover:border-cyber-magenta',
    imageHover: 'group-hover:border-cyber-magenta',
    placeholderHover: 'group-hover:text-cyber-magenta',
    titleHover: 'group-hover:text-cyber-magenta',
    button:
      'border-cyber-magenta text-cyber-magenta hover:bg-cyber-magenta hover:text-white hover:shadow-neon-magenta',
    corner: 'border-cyber-magenta',
  },
  yellow: {
    status: 'text-cyber-yellow',
    cardHover: 'hover:border-cyber-yellow',
    imageHover: 'group-hover:border-cyber-yellow',
    placeholderHover: 'group-hover:text-cyber-yellow',
    titleHover: 'group-hover:text-cyber-yellow',
    button:
      'border-cyber-yellow text-cyber-yellow hover:bg-cyber-yellow hover:text-black hover:shadow-neon-yellow',
    corner: 'border-cyber-yellow',
  },
}

const accentOf = (p) => ACCENTS[p.accent] ?? ACCENTS.cyan

// Links pequeños de demo/repo (solo se renderizan si existen)
function linkButtons(p, a, size = 'text-xs px-3 py-1') {
  return Object.entries({ DEMO: p.links?.demo, REPO: p.links?.repo })
    .filter(([, href]) => href)
    .map(
      ([label, href]) => `
        <a href="${href}" target="_blank" rel="noopener noreferrer"
           class="inline-block border font-bold uppercase tracking-wider transition-all duration-300 ${size} ${a.button}">${label}</a>`,
    )
    .join('')
}

function projectCard(p) {
  const a = accentOf(p)
  const badges = p.techs
    .map(
      (t) => `
        <span class="px-2 py-1 text-xs border ${TECH_STYLES[t.color]} uppercase">${t.label}</span>`,
    )
    .join('')

  const links = linkButtons(p, a)

  return `
    <article data-card="${p.slug}" class="clip-card bg-cyber-surface border border-gray-800 relative group ${a.cardHover} transition-colors duration-300 cursor-pointer">
      <div class="flex justify-between items-center px-4 py-2 border-b border-gray-800 bg-black/50 text-xs text-gray-500">
        <span>SYS.DAT // ${p.hex}</span>
        <span class="${a.status}">${p.status}</span>
      </div>

      <div class="h-48 w-full bg-gray-900 relative clip-image m-4 border border-gray-800 overflow-hidden ${a.imageHover} transition-colors">
        <div class="absolute inset-0 scanline-bg opacity-30 z-10"></div>
        <div class="absolute inset-0" style="background-image: radial-gradient(#333 1px, transparent 1px); background-size: 10px 10px;"></div>
        <div class="absolute inset-0 flex items-center justify-center z-20">
          <span class="text-gray-700 font-bold tracking-widest text-xl opacity-50 transform -rotate-12 ${a.placeholderHover} transition-colors duration-500">${p.placeholder}</span>
        </div>
      </div>

      <div class="p-6 pt-2">
        <h3 class="text-2xl font-bold text-white mb-1 ${a.titleHover} transition-colors uppercase">${p.title}</h3>
        <p class="text-xs tracking-widest mb-3 ${a.status} opacity-70">// PROVES: ${p.proves}</p>
        <p class="text-gray-400 text-sm mb-6 h-20 overflow-hidden">${p.description}</p>
        <div class="flex flex-wrap gap-2 mb-6">${badges}</div>
        <a href="#/project/${p.slug}"
           class="block w-full text-center clip-button py-3 bg-transparent border font-bold uppercase transition-all duration-300 ${a.button}">
         OPEN_CASE_FILE
        </a>
        ${links ? `<div class="flex gap-3 justify-center mt-3">${links}</div>` : ''}
      </div>
      <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${a.corner} opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </article>`
}

function renderProjects() {
  const grid = document.getElementById('projects-grid')
  if (!grid) return
  grid.innerHTML = projects.map(projectCard).join('')

  const count = document.getElementById('projects-count')
  if (count) count.textContent = String(projects.length).padStart(2, '0')

  // Click en cualquier parte de la card abre el detalle,
  // excepto clicks en links reales (demo/repo, botón).
  grid.addEventListener('click', (e) => {
    if (e.target.closest('a')) return
    const card = e.target.closest('[data-card]')
    if (card) location.hash = `#/project/${card.dataset.card}`
  })
}

/* ---------- Detail page (hash routing) ---------- */

// Escapa texto para inyectarlo vía innerHTML sin que el parser de HTML
// interprete etiquetas reales (p.ej. "</script>", "{#key ...}", "<style>").
const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

// Renderiza un campo de prosa: acepta un string (un <p>) o un array
// (lista con viñetas), manteniendo compatibilidad con datos anteriores.
function renderProse(field, a) {
  if (Array.isArray(field)) {
    return `<ul class="space-y-2">${field
      .map(
        (line) =>
          `<li class="text-gray-400 pl-4 border-l-2 ${a.corner}">${escapeHtml(line)}</li>`,
      )
      .join('')}</ul>`
  }
  return `<p>${escapeHtml(field)}</p>`
}

function caseSection(title, a, body) {
  return `
    <section class="mb-8">
      <h3 class="${a.status} text-sm tracking-widest uppercase mb-2">&gt; ${title}</h3>
      ${body}
    </section>`
}

function renderDetailContent(p) {
  const a = accentOf(p)
  const badges = p.techs
    .map(
      (t) => `
        <span class="px-2 py-1 text-xs border ${TECH_STYLES[t.color]} uppercase">${t.label}</span>`,
    )
    .join('')
  const links = linkButtons(p, a, 'text-sm px-6 py-2')

  const header = `
    <div class="clip-card bg-cyber-surface border border-gray-800 relative ${a.cardHover} transition-colors duration-300 mb-8">
      <div class="flex justify-between items-center px-4 py-2 border-b border-gray-800 bg-black/50 text-xs text-gray-500">
        <span>SYS.DAT // ${p.hex}</span>
        <span class="${a.status}">${p.status}</span>
      </div>
      <div class="p-6 md:p-8">
        <h2 class="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-2">${p.title}</h2>
        <p class="text-xs tracking-widest mb-4 ${a.status} opacity-70">// PROVES: ${p.proves}</p>
        <p class="text-gray-400 mb-6">${p.description}</p>
        <div class="flex flex-wrap gap-2 mb-6">${badges}</div>
        ${links ? `<div class="flex flex-wrap gap-3">${links}</div>` : ''}
      </div>
      <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${a.corner}"></div>
    </div>`

  const c = p.caseStudy ?? {
    problem: '[ DATA ENCRYPTED — CASE FILE PENDING ]',
    architecture: '[ DATA ENCRYPTED — CASE FILE PENDING ]',
    tradeoffs: [
      { chose: '[ PENDING ]', over: '[ PENDING ]', because: 'Details coming soon.' },
    ],
    challenges: [
      { issue: '[ PENDING ]', fix: 'Details coming soon.' },
    ],
    retrospective: '[ DATA ENCRYPTED — CASE FILE PENDING ]',
  }

  const tradeoffs = (c.tradeoffs ?? [])
    .map(
      (t) => `
        <li class="mb-2">
          <span class="text-white">${escapeHtml(t.chose)}</span>
          <span class="text-gray-500">over</span>
          <span class="text-white">${escapeHtml(t.over)}</span>
          <span class="text-gray-500">—</span> ${escapeHtml(t.because)}
        </li>`,
    )
    .join('')

  const challenges = (c.challenges ?? [])
    .map(
      (ch) => `
        <li class="mb-3">
          <p class="text-white">${escapeHtml(ch.issue)}</p>
          <p class="text-gray-400 pl-4 border-l-2 ${a.corner}">${escapeHtml(ch.fix)}</p>
        </li>`,
    )
    .join('')

  return (
    header +
    `
    <div class="clip-card bg-cyber-surface border border-gray-800 p-6 md:p-8 text-sm leading-relaxed">
      ${caseSection('PROBLEM', a, renderProse(c.problem, a))}
      ${caseSection('ARCHITECTURE', a, renderProse(c.architecture, a))}
      ${caseSection('TRADEOFFS', a, `<ul>${tradeoffs}</ul>`)}
      ${caseSection('CHALLENGES', a, `<ul>${challenges}</ul>`)}
      ${caseSection('RETROSPECTIVE', a, renderProse(c.retrospective, a))}
    </div>`
  )
}

function showGrid() {
  document.getElementById('home')?.classList.remove('hidden')
  document.getElementById('projects')?.classList.remove('hidden')
  document.getElementById('contact-terminal')?.classList.remove('hidden')
  document.getElementById('project-detail')?.classList.add('hidden')
}

function showDetail(slug) {
  const p = projects.find((x) => x.slug === slug)
  const home = document.getElementById('home')
  const grid = document.getElementById('projects')
  const terminal = document.getElementById('contact-terminal')
  const detail = document.getElementById('project-detail')
  const content = document.getElementById('project-detail-content')
  if (!p || !grid || !detail || !content) {
    showGrid()
    return
  }
  content.innerHTML = renderDetailContent(p)
  document.title = `${p.title} // CYBERPUNK_PORTFOLIO`
  home?.classList.add('hidden')
  grid.classList.add('hidden')
  terminal?.classList.add('hidden')
  detail.classList.remove('hidden')
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
}

function router() {
  const match = location.hash.match(/^#\/project\/(.+)$/)
  if (match) {
    showDetail(match[1])
  } else {
    document.title = 'Full Stack Developer // CYBERPUNK_PORTFOLIO'
    showGrid()
  }
}

renderProjects()
window.addEventListener('hashchange', router)
router()
