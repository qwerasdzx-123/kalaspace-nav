import { BookmarkData, Env, AuthData } from '../../shared/types';

// ═══ Static Templates (extracted from index.html) ═══
const STATIC_CSS = `/* ============================================================
   KalaSpace Security Navigator — Hacker/Terminal Theme
   ============================================================ */

/* ----- CSS Variables (Dual Theme) ----- */
:root, .io-grey-mode {
  --bg-primary: #f0f2f5;
  --bg-secondary: #ffffff;
  --bg-tertiary: #e8eaed;
  --bg-card: #ffffff;
  --bg-sidebar: #1e1f2b;
  --bg-sidebar-hover: rgba(0,255,65,0.06);
  --bg-sidebar-active: rgba(0,255,65,0.10);
  --bg-input: #ffffff;
  --text-primary: #1a1b1e;
  --text-secondary: #5f6368;
  --text-sidebar: #9aa0a6;
  --text-sidebar-hover: #e8eaed;
  --accent-primary: #0d9e5e;
  --accent-glow: rgba(13,158,94,0.25);
  --accent-bg: rgba(13,158,94,0.08);
  --accent-border: rgba(13,158,94,0.3);
  --border-color: rgba(0,0,0,0.08);
  --border-card: rgba(0,0,0,0.06);
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --code-bg: #f1f3f4;
}

.io-black-mode {
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --bg-tertiary: #21262d;
  --bg-card: #161b22;
  --bg-sidebar: #0d1117;
  --bg-sidebar-hover: rgba(0,255,65,0.06);
  --bg-sidebar-active: rgba(0,255,65,0.10);
  --bg-input: #0d1117;
  --text-primary: #c9d1d9;
  --text-secondary: #8b949e;
  --text-sidebar: #8b949e;
  --text-sidebar-hover: #e6edf3;
  --accent-primary: #00ff41;
  --accent-glow: rgba(0,255,65,0.20);
  --accent-bg: rgba(0,255,65,0.06);
  --accent-border: rgba(0,255,65,0.25);
  --border-color: rgba(240,246,252,0.08);
  --border-card: rgba(48,54,61,0.6);
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.24);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.3);
  --code-bg: #0d1117;
}

/* ----- Sidebar Dimensions ----- */
:root {
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 56px;
  --header-height: 56px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --font-mono: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, monospace;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
}

/* ----- Reset & Base ----- */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font-sans);
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  transition: background var(--transition-smooth), color var(--transition-smooth);
}

/* ----- Header ----- */
.header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 1100;
  height: var(--header-height);
  transition: background var(--transition-smooth);
}
.header-inner {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: 16px;
}
.header-left { display: flex; align-items: center; gap: 12px; }
.header-right { display: flex; align-items: center; gap: 10px; }

.hamburger-btn {
  display: none;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 1.3rem;
  width: 36px;
  height: 36px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}
.hamburger-btn:hover { color: var(--accent-primary); border-color: var(--accent-primary); }

.logo { display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--text-primary); }
.logo-icon {
  width: 34px; height: 34px;
  background: linear-gradient(135deg, var(--accent-primary), #00c853);
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; color: #000;
}
.logo-text {
  font-size: 1.15rem; font-weight: 700;
  font-family: var(--font-mono);
  color: var(--accent-primary);
  letter-spacing: -0.5px;
}

/* ----- Header Icon Links ----- */
.header-right a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px; height: 36px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 1.25rem;
  text-decoration: none;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}
.header-right a:hover {
  color: var(--accent-primary);
  background: var(--accent-bg);
  border-color: var(--accent-border);
  transform: translateY(-1px);
}

.theme-toggle {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 1.1rem;
  width: 36px; height: 36px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition-fast);
}
.theme-toggle:hover { color: var(--accent-primary); border-color: var(--accent-primary); transform: rotate(15deg); }

/* ----- Search ----- */
.search-box {
  max-width: 1600px;
  margin: 16px auto 12px;
  padding: 0 20px;
}
.search-wrapper { position: relative; }
.search-wrapper::before {
  content: '>_';
  position: absolute;
  left: 16px; top: 50%;
  transform: translateY(-50%);
  color: var(--accent-primary);
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 700;
  opacity: 0.6;
  z-index: 2;
  pointer-events: none;
}
.search-box input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  font-size: 0.92rem;
  background: var(--bg-input);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-mono);
  transition: all var(--transition-smooth);
  box-sizing: border-box;
}
.search-box input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 20px var(--accent-glow);
}
.search-box input::placeholder { color: var(--text-secondary); opacity: 0.5; }
.search-hint {
  position: absolute; right: 14px; top: 50%;
  transform: translateY(-50%);
  font-size: 0.68rem;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  opacity: 0.45;
  pointer-events: none;
  background: var(--bg-tertiary);
  padding: 2px 7px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

/* ----- Main Layout ----- */
.main-layout {
  display: flex;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px 40px;
  gap: 20px;
  min-height: calc(100vh - var(--header-height) - 80px);
}

/* ----- Sidebar ----- */
.sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  position: sticky;
  top: var(--header-height);
  height: calc(100vh - var(--header-height));
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--bg-sidebar);
  border-radius: var(--radius-md);
  padding: 12px 0;
  transition: width var(--transition-smooth), opacity var(--transition-smooth);
  z-index: 100;
}
.sidebar::-webkit-scrollbar { width: 4px; }
.sidebar::-webkit-scrollbar-track { background: transparent; }
.sidebar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 2px; }
.sidebar::-webkit-scrollbar-thumb:hover { background: var(--accent-primary); }

.sidebar-toggle {
  display: none;  /* shown via JS or always visible */
}

/* Sidebar collapsed */
.sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
  overflow: hidden;
}
.sidebar.collapsed .nav-group-header span,
.sidebar.collapsed .nav-group-content,
.sidebar.collapsed .bookmark-link { display: none; }
.sidebar.collapsed .nav-group-header { justify-content: center; padding: 10px 0; }
.sidebar.collapsed .nav-group-header i { font-size: 1.2rem; }

.main-layout.sidebar-collapsed {
  /* no margin change needed since sidebar is flex child */
}

/* ----- Nav Group (Category) ----- */
.nav-group { margin-bottom: 2px; }

.nav-group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  margin: 2px 6px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-sidebar);
  transition: all var(--transition-smooth);
  user-select: none;
  white-space: nowrap;
}
.nav-group-header:hover {
  background: var(--bg-sidebar-hover);
  color: var(--text-sidebar-hover);
}
.nav-group-header.active,
.nav-group-header.router-link-active {
  background: var(--bg-sidebar-active);
  color: var(--accent-primary);
}

.nav-group-header i { font-size: 1.05rem; flex-shrink: 0; }
.nav-group-header span { flex: 1; overflow: hidden; text-overflow: ellipsis; }

.nav-group-header .arrow {
  font-size: 10px;
  transition: transform var(--transition-smooth);
  opacity: 0.5;
  flex-shrink: 0;
}
.nav-group.expanded > .nav-group-header .arrow { transform: rotate(90deg); opacity: 1; }

/* Nav group content (subcategories) */
.nav-group-content {
  display: none;
  padding: 2px 0 4px;
}
.nav-group.expanded > .nav-group-content { display: block; }

/* Sub-category link (in sidebar) */
.sub-category-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px 7px 36px;
  margin: 1px 6px;
  border-radius: var(--radius-sm);
  color: var(--text-sidebar);
  text-decoration: none;
  font-size: 0.8rem;
  transition: all var(--transition-fast);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sub-category-link:hover {
  background: var(--bg-sidebar-hover);
  color: var(--accent-primary);
  padding-left: 40px;
}
.sub-category-link.active {
  background: var(--bg-sidebar-active);
  color: var(--accent-primary);
}

/* Direct bookmark link (in sidebar, for categories with no subcategory) */
.bookmark-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 6px 36px;
  margin: 1px 6px;
  border-radius: var(--radius-sm);
  color: var(--text-sidebar);
  text-decoration: none;
  font-size: 0.78rem;
  transition: all var(--transition-fast);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bookmark-link:hover {
  background: var(--bg-sidebar-hover);
  color: var(--accent-primary);
}

/* ----- Main Content ----- */
.main-content {
  flex: 1;
  min-width: 0;
  padding-top: 4px;
}

/* ----- Section ----- */
.section {
  margin-bottom: 32px;
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}
.section-header i { color: var(--accent-primary); font-size: 1.3rem; }
.section-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-mono);
}
.section-header .count {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  opacity: 0.6;
}

/* ----- Sub-section ----- */
.sub-section { margin-bottom: 20px; }
.sub-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding: 4px 0;
}
.sub-section-header::before {
  content: '>';
  color: var(--accent-primary);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.85rem;
}
.sub-section-header h3 {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-secondary);
  font-family: var(--font-mono);
}

/* ----- Bookmark Grid ----- */
.bookmark-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 10px;
}

/* ----- Bookmark Card ----- */
.bookmark-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-smooth);
  position: relative;
  overflow: hidden;
}
.bookmark-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--accent-primary);
  opacity: 0;
  transition: opacity var(--transition-smooth);
}
.bookmark-card:hover {
  border-color: var(--accent-border);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}
.bookmark-card:hover::before { opacity: 0.7; }

.bookmark-icon {
  width: 34px; height: 34px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  background: var(--accent-bg);
}
.bookmark-favicon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
.bookmark-info { flex: 1; min-width: 0; }
.bookmark-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}
.bookmark-url {
  font-size: 0.7rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--font-mono);
  opacity: 0.6;
}

/* ----- Sidebar Overlay (Mobile) ----- */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--overlay-bg, rgba(0,0,0,0.5));
  z-index: 1050;
}

/* ----- Responsive ----- */
@media (max-width: 900px) {
  .hamburger-btn { display: flex !important; }
  .sidebar {
    position: fixed;
    top: 0; left: 0;
    height: 100vh;
    z-index: 1060;
    transform: translateX(-100%);
    border-radius: 0;
    border-right: 1px solid var(--border-color);
  }
  .sidebar.mobile-open { transform: translateX(0); }
  .sidebar-overlay.active { display: block; }
  .main-layout { flex-direction: column; }
  .bookmark-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
}

  </style>
`;

const STATIC_HEADER = `<body>
  <!-- Header -->
  <header class="header">
    <div class="header-inner">
      <div class="header-left">
        <button class="hamburger-btn" id="hamburgerBtn">&#9776;</button>
        <a href="#" class="logo" id="logoLink">
          <div class="logo-icon"><i class="ri-shield-line"></i></div>
          <div class="logo-text">KalaSpace</div>
        </a>
      </div>
      <div class="header-right">
        <a href="https://x.com/kalaspace002" target="_blank" title="X.COM"><i class="ri-twitter-x-line"></i></a>
        <a href="https://github.com/qwerasdzx-123" target="_blank" title="GitHub"><i class="ri-github-line"></i></a>
        <a href="https://blog.kalaspace.dpdns.org/" target="_blank" title="Blog (Cloudflare)"><i class="ri-cloud-line"></i></a>
        <button class="theme-toggle" id="themeToggle" title="切换主题">&#9790;</button>
      </div>
    </div>
  </header>
`;

const STATIC_SEARCH = `  <div class="search-box">
    <div class="search-wrapper">
      <input type="text" id="searchInput" placeholder="Search bookmarks... (Ctrl+K)" autocomplete="off">
      <span class="search-hint">Ctrl+K</span>
    </div>
  </div>
  <!-- Main Layout -->
  <div class="main-layout" id="mainLayout">
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    <aside class="sidebar" id="sidebar">
`;

const STATIC_FOOTER = `  <script>

  /* ----- Theme ----- */
  function applyTheme(theme) {
    document.documentElement.className = theme;
    localStorage.setItem('kalaspace-theme', theme);
    var btn = document.getElementById('themeToggle');
    if (btn) btn.innerHTML = theme === 'io-black-mode' ? '&#9790;' : '&#9788;';
  }
  function toggleTheme() {
    var current = document.documentElement.className;
    applyTheme(current === 'io-black-mode' ? 'io-grey-mode' : 'io-black-mode');
  }

  /* ----- Sidebar Collapse ----- */
  function toggleSidebar() {
    var sb = document.getElementById('sidebar');
    var ml = document.getElementById('mainLayout');
    if (sb.classList.contains('collapsed')) {
      sb.classList.remove('collapsed');
      if (ml) ml.classList.remove('sidebar-collapsed');
    } else {
      sb.classList.add('collapsed');
      if (ml) ml.classList.add('sidebar-collapsed');
    }
  }

  /* ----- Sidebar Nav Group Expand/Collapse ----- */
  function initSidebar() {
    var headers = document.querySelectorAll('.nav-group-header');
    headers.forEach(function(hdr) {
      hdr.addEventListener('click', function() {
        var group = hdr.parentElement;
        var wasExpanded = group.classList.contains('expanded');
        // Collapse all
        document.querySelectorAll('.nav-group.expanded').forEach(function(g) {
          g.classList.remove('expanded');
        });
        // Toggle clicked
        if (!wasExpanded) {
          group.classList.add('expanded');
        }
        // Scroll to section
        var sec = hdr.getAttribute('data-section');
        if (sec) {
          var el = document.getElementById(sec);
          if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
      });
    });

    /* Sub-category link click */
    var subLinks = document.querySelectorAll('.sub-category-link');
    subLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var sec = link.getAttribute('data-section');
        var sub = link.getAttribute('data-sub');
        if (sec && sub) {
          var el = document.getElementById(sec + '-' + sub);
          if (!el && sec) el = document.getElementById(sec);
          if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
        /* Highlight active */
        document.querySelectorAll('.sub-category-link.active').forEach(function(a) { a.classList.remove('active'); });
        link.classList.add('active');
      });
    });
  }

  /* ----- Search ----- */
  function initSearch() {
    var input = document.getElementById('searchInput');
    if (!input) return;
    input.addEventListener('input', function() {
      var q = input.value.trim().toLowerCase();
      var cards = document.querySelectorAll('.bookmark-card');
      var sections = document.querySelectorAll('.section');
      var visibleSections = new Set();

      cards.forEach(function(card) {
        var name = (card.querySelector('.bookmark-name') || {}).textContent || '';
        var url = (card.querySelector('.bookmark-url') || {}).textContent || '';
        var match = !q || name.toLowerCase().indexOf(q) !== -1 || url.toLowerCase().indexOf(q) !== -1;
        card.style.display = match ? '' : 'none';
        if (match) {
          var sec = card.closest('.section');
          if (sec) visibleSections.add(sec.id);
        }
      });

      sections.forEach(function(sec) {
        if (q) {
          sec.style.display = visibleSections.has(sec.id) ? '' : 'none';
        } else {
          sec.style.display = '';
        }
      });
    });
  }

  /* ----- Init ----- */
  document.addEventListener('DOMContentLoaded', function() {
    /* Theme */
    var saved = localStorage.getItem('kalaspace-theme');
    if (saved) {
      applyTheme(saved);
    } else {
      applyTheme('io-black-mode');
    }
    var themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    /* Sidebar toggle */
    var toggleBtn = document.getElementById('sidebarToggle');
    if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);

    /* Hamburger (mobile) */
    var hb = document.getElementById('hamburgerBtn');
    var sb = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    if (hb && sb) {
      hb.addEventListener('click', function() {
        sb.classList.toggle('mobile-open');
        if (overlay) overlay.classList.toggle('active');
      });
    }
    if (overlay && sb) {
      overlay.addEventListener('click', function() {
        sb.classList.remove('mobile-open');
        overlay.classList.remove('active');
      });
    }

    initSidebar();
    initSearch();

    /* Ctrl+K focus search */
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        var inp = document.getElementById('searchInput');
        if (inp) inp.focus();
      }
    });
  });

  </script>
`;

// ═══ UUID Generator ═══
function uuid(): string {
  return 'bm-' + crypto.randomUUID().slice(0, 8);
}

// ═══ HTML Escape ═══
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ═══ Domain Extraction ═══
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url.split('/')[2] || url;
  }
}

// ═══ Crypto Helpers ═══
async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacSha256(key: string, msg: string): Promise<string> {
  const keyBuf = await crypto.subtle.importKey('raw', new TextEncoder().encode(key),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', keyBuf, new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function b64url(data: string): string {
  return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ═══ Auth Helpers ═══
async function createToken(secret: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + 86400;
  const payload = b64url(JSON.stringify({ exp }));
  const sig = await hmacSha256(secret, payload);
  return payload + '.' + sig;
}

async function verifyToken(token: string, secret: string): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const sig = await hmacSha256(secret, parts[0]);
  if (sig !== parts[1]) return false;
  try {
    const { exp } = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    return Date.now() / 1000 < exp;
  } catch {
    return false;
  }
}

function getTokenFromRequest(req: Request): string | null {
  const cookie = req.headers.get('Cookie') || '';
  const match = cookie.match(/kalaspace_token=([^;]+)/);
  return match ? match[1] : null;
}

// ═══ KV Data Helpers ═══
async function getData(kv: KVNamespace): Promise<BookmarkData> {
  const raw = await kv.get('bookmarks_data');
  if (!raw) throw new Error('No bookmark data found. Please initialize first.');
  return JSON.parse(raw);
}

async function setData(kv: KVNamespace, data: BookmarkData): Promise<void> {
  data.lastModified = new Date().toISOString();
  await kv.put('bookmarks_data', JSON.stringify(data));
}

async function getAuth(kv: KVNamespace): Promise<AuthData> {
  const raw = await kv.get('bookmarks_auth');
  if (!raw) throw new Error('Not initialized');
  return JSON.parse(raw);
}

// ═══ HTML Generator ═══
function generateIndexHtml(data: BookmarkData): string {
  const sidebarHtml = data.categories.map((cat, i) => {
    const hasSubs = cat.subCategories.length > 1 ||
      (cat.subCategories.length === 1 && cat.subCategories[0].name !== cat.name);
    const activeClass = i === 0 ? ' active' : '';

    const contentHtml = hasSubs
      ? cat.subCategories.map(sub => {
          const count = sub.bookmarks.length;
          return `        <a class="sub-category-link" data-section="section-${cat.id}" data-sub="${esc(sub.name)}" title="${esc(sub.name)} (${count})">\n          ${esc(sub.name)} (${count})\n        </a>`;
        }).join('\n')
      : cat.subCategories.flatMap(sub => sub.bookmarks).map(bm =>
          `        <a class="bookmark-link" href="${esc(bm.url)}" target="_blank" title="${esc(bm.name)}">\n          <img class="bookmark-favicon" src="https://www.google.com/s2/favicons?domain=${esc(bm.domain)}&sz=16" onerror="this.style.display='none'"> ${esc(bm.name.length > 30 ? bm.name.slice(0, 30) : bm.name)}\n        </a>`
        ).join('\n');

    return `      <div class="nav-group" data-section="section-${cat.id}">\n        <div class="nav-group-header" data-section="section-${cat.id}" title="${esc(cat.name)}">\n          <i class="${cat.icon}"></i>\n          <span>${esc(cat.name)}</span>\n          <i class="ri-arrow-right-s-line arrow"></i>\n        </div>\n        <div class="nav-group-content">\n${contentHtml}\n        </div>\n      </div>`;
  }).join('\n');

  const mainHtml = data.categories.map(cat => {
    const total = cat.subCategories.reduce((s, sub) => s + sub.bookmarks.length, 0);
    const hasSubs = cat.subCategories.length > 1 ||
      (cat.subCategories.length === 1 && cat.subCategories[0].name !== cat.name);

    const subHtml = hasSubs
      ? cat.subCategories.map(sub => {
          const cards = sub.bookmarks.map(bm =>
            `          <a class="bookmark-card" href="${esc(bm.url)}" target="_blank" title="${esc(bm.name)}">\n            <div class="bookmark-icon"><img class="bookmark-favicon" src="https://www.google.com/s2/favicons?domain=${esc(bm.domain)}&sz=32" onerror="this.style.display='none'"></div>\n            <div class="bookmark-info">\n              <div class="bookmark-name">${esc(bm.name)}</div>\n              <div class="bookmark-url">${esc(bm.domain)}</div>\n            </div>\n          </a>`
          ).join('\n');
          return `        <div class="sub-section" id="section-${cat.id}-${esc(sub.name)}">\n          <div class="sub-section-header"><h3>${esc(sub.name)}</h3></div>\n          <div class="bookmark-grid">\n${cards}\n          </div>\n        </div>`;
        }).join('\n')
      : (() => {
          const cards = cat.subCategories.flatMap(s => s.bookmarks).map(bm =>
            `          <a class="bookmark-card" href="${esc(bm.url)}" target="_blank" title="${esc(bm.name)}">\n            <div class="bookmark-icon"><img class="bookmark-favicon" src="https://www.google.com/s2/favicons?domain=${esc(bm.domain)}&sz=32" onerror="this.style.display='none'"></div>\n            <div class="bookmark-info">\n              <div class="bookmark-name">${esc(bm.name)}</div>\n              <div class="bookmark-url">${esc(bm.domain)}</div>\n            </div>\n          </a>`
          ).join('\n');
          return `        <div class="sub-section" id="section-${cat.id}-direct">\n          <div class="sub-section-header"><h3>${esc(cat.name)}</h3></div>\n          <div class="bookmark-grid">\n${cards}\n          </div>\n        </div>`;
        })();

    return `      <section class="section" id="section-${cat.id}">\n        <div class="section-header">\n          <i class="${cat.icon}"></i>\n          <h2>${esc(cat.name)}</h2>\n          <span class="count">(${total})</span>\n        </div>\n${subHtml}\n      </section>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN" class="io-black-mode">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KalaSpace - 安全导航</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔒</text></svg>">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css">
  <style>
${STATIC_CSS}
  </style>
</head>
<body>
${STATIC_HEADER}
${STATIC_SEARCH}
  <div class="main-layout" id="mainLayout">
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-inner">
${sidebarHtml}
      </div>
    </aside>
    <div class="main-content" id="mainContent">
${mainHtml}
    </div>
  </div>
  <script>
${STATIC_FOOTER}
  </script>
</body>
</html>`;
}

// ═══ GitHub Sync ═══
async function syncToGitHub(env: Env, content: string): Promise<string> {
  const api = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/index.html`;

  // Get current SHA
  const getRes = await fetch(api, {
    headers: {
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'User-Agent': 'KalaSpace-Bot'
    }
  });
  const getData = await getRes.json() as { sha: string };
  const sha = getData.sha;

  // Update file
  const putRes = await fetch(api, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'KalaSpace-Bot'
    },
    body: JSON.stringify({
      message: `Update index.html - ${new Date().toISOString().slice(0, 10)}`,
      content: btoa(unescape(encodeURIComponent(content))),
      sha,
      branch: 'main'
    })
  });
  const putData = await putRes.json() as { commit: { sha: string } };
  return putData.commit.sha;
}

// ═══ Chrome Bookmarks Parser ═══
function parseChromeBookmarks(html: string) {
  const result: { name: string; url: string; domain: string }[] = [];

  // Match all <A> tags with HREF
  const linkRegex = /<DT><A[^>]*HREF="([^"]*)"[^>]*>([^<]*)<\/A>/gi;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const url = match[1];
    const name = match[2].trim();
    if (url.startsWith('http://') || url.startsWith('https://')) {
      result.push({ name, url, domain: extractDomain(url) });
    }
  }

  return result;
}

function parseChromeFolders(html: string) {
  const folders: { name: string; bookmarks: { name: string; url: string; domain: string }[] }[] = [];

  // Match folder structure: <DT><H3>name</H3><DL>...links...</DL>
  const folderRegex = /<DT><H3[^>]*>([^<]*)<\/H3>\s*<DL><p>([\s\S]*?)<\/DL><p>/gi;
  let match;
  while ((match = folderRegex.exec(html)) !== null) {
    const name = match[1].trim();
    const content = match[2];
    const bookmarks = parseChromeBookmarks(content);
    folders.push({ name, bookmarks });
  }

  return folders;
}

// ═══ Index.html Parser (for init) ═══
function parseCurrentIndexHtml(html: string): BookmarkData {
  const data: BookmarkData = { version: 1, lastModified: new Date().toISOString(), categories: [] };

  // Parse sections
  const sectionRegex = /<section[^>]*id="section-(\d+)"[^>]*>[\s\S]*?<\/section>/gi;
  let sectionMatch;

  while ((sectionMatch = sectionRegex.exec(html)) !== null) {
    const sectionHtml = sectionMatch[0];
    const catId = parseInt(sectionMatch[1]);

    // Extract category name from section-header
    const nameMatch = sectionHtml.match(/<h2>([^<]*)<\/h2>/);
    const catName = nameMatch ? nameMatch[1] : `Category ${catId}`;

    // Extract icon
    const iconMatch = sectionHtml.match(/<i class="([^"]*)"><\/i>/);
    const catIcon = iconMatch ? iconMatch[1] : 'ri-star-line';

    // Parse sub-sections
    const subs: { id: string; name: string; bookmarks: { id: string; name: string; url: string; domain: string }[] }[] = [];
    const subRegex = /<div class="sub-section" id="section-\d+-([^"]*)"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi;
    let subMatch;

    while ((subMatch = subRegex.exec(sectionHtml)) !== null) {
      const subHtml = subMatch[0];
      const subId = subMatch[1];

      const subNameMatch = subHtml.match(/<h3>([^<]*)<\/h3>/);
      const subName = subNameMatch ? subNameMatch[1] : subId;

      // Parse bookmark cards
      const bookmarks: { id: string; name: string; url: string; domain: string }[] = [];
      const cardRegex = /<a class="bookmark-card"[^>]*href="([^"]*)"[^>]*>[\s\S]*?<div class="bookmark-name">([^<]*)<\/div>[\s\S]*?<\/a>/gi;
      let cardMatch;

      while ((cardMatch = cardRegex.exec(subHtml)) !== null) {
        const url = cardMatch[1];
        const name = cardMatch[2].trim();
        bookmarks.push({ id: uuid(), name, url, domain: extractDomain(url) });
      }

      subs.push({ id: `${catId}-${subs.length}`, name: subName, bookmarks });
    }

    data.categories.push({ id: catId, name: catName, icon: catIcon, subCategories: subs });
  }

  return data;
}

// ═══ Export Chrome Bookmarks HTML ═══
function exportToChromeHtml(data: BookmarkData): string {
  let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`;

  for (const cat of data.categories) {
    html += `    <DT><H3>${esc(cat.name)}</H3>\n    <DL><p>\n`;
    for (const sub of cat.subCategories) {
      if (data.categories.find(c => c.id === cat.id)?.subCategories.length === 1 && sub.name === cat.name) continue;
      html += `    <DT><H3>${esc(sub.name)}</H3>\n    <DL><p>\n`;
      for (const bm of sub.bookmarks) {
        html += `        <DT><A HREF="${esc(bm.url)}">${esc(bm.name)}</A>\n`;
      }
      html += `    </DL><p>\n`;
    }
    html += `    </DL><p>\n`;
  }

  html += `</DL><p>\n`;
  return html;
}

// ═══ CORS Headers ═══
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ═══ Main Handler ═══
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  const { action } = body;

  try {
    let result: any;

    switch (action) {
      // ── Auth ────────────────────────────────────────────────────
      case 'login': {
        const { password } = body;
        const auth = await getAuth(env.BOOKMARKS_KV);
        const hash = await sha256(password + auth.salt);
        if (hash !== auth.hash) {
          result = { success: false, error: '密码错误' };
          break;
        }
        const token = await createToken(env.AUTH_SECRET);
        return new Response(JSON.stringify({ success: true }), {
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `kalaspace_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`,
            ...corsHeaders
          }
        });
      }

      case 'verify': {
        const token = getTokenFromRequest(request);
        const valid = token ? await verifyToken(token, env.AUTH_SECRET) : false;
        result = { valid };
        break;
      }

      case 'init': {
        const existing = await env.BOOKMARKS_KV.get('bookmarks_auth');
        if (existing) {
          result = { success: false, error: 'Already initialized' };
          break;
        }
        const { password } = body;
        const salt = crypto.randomUUID().slice(0, 16);
        const hash = await sha256(password + salt);
        await env.BOOKMARKS_KV.put('bookmarks_auth', JSON.stringify({ salt, hash }));

        // Parse current index.html to extract bookmarks
        const indexRes = await fetch(`https://raw.githubusercontent.com/${env.GITHUB_REPO}/main/index.html`);
        const indexHtml = await indexRes.text();
        const data = parseCurrentIndexHtml(indexHtml);
        await env.BOOKMARKS_KV.put('bookmarks_data', JSON.stringify(data));

        result = { success: true, count: data.categories.reduce((s, c) => s + c.subCategories.reduce((s2, sc) => s2 + sc.bookmarks.length, 0), 0) };
        break;
      }

      // ── Read ────────────────────────────────────────────────────
      case 'getBookmarks': {
        const data = await getData(env.BOOKMARKS_KV);
        result = data;
        break;
      }

      // ── Bookmark CRUD ───────────────────────────────────────────
      case 'addBookmark': {
        const token = getTokenFromRequest(request);
        if (!token || !await verifyToken(token, env.AUTH_SECRET)) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
        const { categoryId, subCategoryId, name, url } = body;
        const data = await getData(env.BOOKMARKS_KV);
        const cat = data.categories.find(c => c.id === categoryId);
        if (!cat) throw new Error('Category not found');
        const sub = cat.subCategories.find(s => s.id === subCategoryId);
        if (!sub) throw new Error('SubCategory not found');
        const newBm = { id: uuid(), name, url, domain: extractDomain(url) };
        sub.bookmarks.push(newBm);
        await setData(env.BOOKMARKS_KV, data);
        result = newBm;
        break;
      }

      case 'updateBookmark': {
        const token = getTokenFromRequest(request);
        if (!token || !await verifyToken(token, env.AUTH_SECRET)) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
        const { id, name, url, categoryId, subCategoryId } = body;
        const data = await getData(env.BOOKMARKS_KV);
        let found = false;
        for (const cat of data.categories) {
          for (const sub of cat.subCategories) {
            const idx = sub.bookmarks.findIndex(b => b.id === id);
            if (idx !== -1) {
              if (name) sub.bookmarks[idx].name = name;
              if (url) { sub.bookmarks[idx].url = url; sub.bookmarks[idx].domain = extractDomain(url); }
              // Move to different category if specified
              if (categoryId !== undefined && subCategoryId !== undefined) {
                const [bm] = sub.bookmarks.splice(idx, 1);
                const targetCat = data.categories.find(c => c.id === categoryId);
                const targetSub = targetCat?.subCategories.find(s => s.id === subCategoryId);
                if (targetSub) targetSub.bookmarks.push(bm);
              }
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (!found) throw new Error('Bookmark not found');
        await setData(env.BOOKMARKS_KV, data);
        result = { success: true };
        break;
      }

      case 'deleteBookmark': {
        const token = getTokenFromRequest(request);
        if (!token || !await verifyToken(token, env.AUTH_SECRET)) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
        const { id } = body;
        const data = await getData(env.BOOKMARKS_KV);
        for (const cat of data.categories) {
          for (const sub of cat.subCategories) {
            const idx = sub.bookmarks.findIndex(b => b.id === id);
            if (idx !== -1) {
              sub.bookmarks.splice(idx, 1);
              await setData(env.BOOKMARKS_KV, data);
              result = { success: true };
              break;
            }
          }
        }
        if (!result) throw new Error('Bookmark not found');
        break;
      }

      case 'batchDelete': {
        const token = getTokenFromRequest(request);
        if (!token || !await verifyToken(token, env.AUTH_SECRET)) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
        const { ids } = body as { ids: string[] };
        const data = await getData(env.BOOKMARKS_KV);
        const idSet = new Set(ids);
        let count = 0;
        for (const cat of data.categories) {
          for (const sub of cat.subCategories) {
            const before = sub.bookmarks.length;
            sub.bookmarks = sub.bookmarks.filter(b => !idSet.has(b.id));
            count += before - sub.bookmarks.length;
          }
        }
        await setData(env.BOOKMARKS_KV, data);
        result = { success: true, deleted: count };
        break;
      }

      // ── Category CRUD ───────────────────────────────────────────
      case 'addCategory': {
        const token = getTokenFromRequest(request);
        if (!token || !await verifyToken(token, env.AUTH_SECRET)) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
        const { name, icon } = body;
        const data = await getData(env.BOOKMARKS_KV);
        const maxId = data.categories.reduce((max, c) => Math.max(max, c.id), -1);
        const newCat = { id: maxId + 1, name, icon: icon || 'ri-star-line', subCategories: [{ id: `${maxId + 1}-0`, name, bookmarks: [] }] };
        data.categories.push(newCat);
        await setData(env.BOOKMARKS_KV, data);
        result = newCat;
        break;
      }

      case 'updateCategory': {
        const token = getTokenFromRequest(request);
        if (!token || !await verifyToken(token, env.AUTH_SECRET)) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
        const { id, name, icon } = body;
        const data = await getData(env.BOOKMARKS_KV);
        const cat = data.categories.find(c => c.id === id);
        if (!cat) throw new Error('Category not found');
        if (name) cat.name = name;
        if (icon) cat.icon = icon;
        await setData(env.BOOKMARKS_KV, data);
        result = { success: true };
        break;
      }

      case 'deleteCategory': {
        const token = getTokenFromRequest(request);
        if (!token || !await verifyToken(token, env.AUTH_SECRET)) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
        const { id } = body;
        const data = await getData(env.BOOKMARKS_KV);
        data.categories = data.categories.filter(c => c.id !== id);
        // Re-index IDs
        data.categories.forEach((c, i) => c.id = i);
        await setData(env.BOOKMARKS_KV, data);
        result = { success: true };
        break;
      }

      // ── SubCategory CRUD ────────────────────────────────────────
      case 'addSubCategory': {
        const token = getTokenFromRequest(request);
        if (!token || !await verifyToken(token, env.AUTH_SECRET)) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
        const { categoryId, name } = body;
        const data = await getData(env.BOOKMARKS_KV);
        const cat = data.categories.find(c => c.id === categoryId);
        if (!cat) throw new Error('Category not found');
        const newSubId = `${categoryId}-${cat.subCategories.length}`;
        cat.subCategories.push({ id: newSubId, name, bookmarks: [] });
        await setData(env.BOOKMARKS_KV, data);
        result = { id: newSubId, name };
        break;
      }

      case 'deleteSubCategory': {
        const token = getTokenFromRequest(request);
        if (!token || !await verifyToken(token, env.AUTH_SECRET)) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
        const { categoryId, subCategoryId } = body;
        const data = await getData(env.BOOKMARKS_KV);
        const cat = data.categories.find(c => c.id === categoryId);
        if (!cat) throw new Error('Category not found');
        cat.subCategories = cat.subCategories.filter(s => s.id !== subCategoryId);
        await setData(env.BOOKMARKS_KV, data);
        result = { success: true };
        break;
      }

      // ── Reorder ─────────────────────────────────────────────────
      case 'reorder': {
        const token = getTokenFromRequest(request);
        if (!token || !await verifyToken(token, env.AUTH_SECRET)) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
        const { type, items } = body;
        const data = await getData(env.BOOKMARKS_KV);

        if (type === 'bookmark') {
          const { categoryId, subCategoryId } = body;
          const cat = data.categories.find(c => c.id === categoryId);
          const sub = cat?.subCategories.find(s => s.id === subCategoryId);
          if (sub) {
            const newOrder = items.map((i: { id: string }) => sub.bookmarks.find(b => b.id === i.id)).filter(Boolean);
            sub.bookmarks = newOrder;
          }
        } else if (type === 'subcategory') {
          const { categoryId } = body;
          const cat = data.categories.find(c => c.id === categoryId);
          if (cat) {
            const newOrder = items.map((i: { id: string }) => cat.subCategories.find(s => s.id === i.id)).filter(Boolean);
            cat.subCategories = newOrder;
          }
        } else if (type === 'category') {
          const newOrder = items.map((i: { id: number }) => data.categories.find(c => c.id === i.id)).filter(Boolean);
          data.categories = newOrder;
        }

        await setData(env.BOOKMARKS_KV, data);
        result = { success: true };
        break;
      }

      // ── Import Chrome Bookmarks ─────────────────────────────────
      case 'importChrome': {
        const token = getTokenFromRequest(request);
        if (!token || !await verifyToken(token, env.AUTH_SECRET)) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
        const { html: chromeHtml, categoryId, mode } = body;
        const data = await getData(env.BOOKMARKS_KV);
        const parsed = parseChromeBookmarks(chromeHtml);
        const cat = data.categories.find(c => c.id === categoryId);
        if (!cat) throw new Error('Category not found');

        if (mode === 'replace') {
          cat.subCategories.forEach(s => s.bookmarks = []);
        }

        const subId = cat.subCategories[0]?.id || `${categoryId}-0`;
        for (const bm of parsed) {
          cat.subCategories[0]?.bookmarks.push({
            id: uuid(), name: bm.name, url: bm.url, domain: bm.domain
          });
        }

        await setData(env.BOOKMARKS_KV, data);
        result = { success: true, imported: parsed.length };
        break;
      }

      // ── Export ──────────────────────────────────────────────────
      case 'exportHtml': {
        const data = await getData(env.BOOKMARKS_KV);
        const html = exportToChromeHtml(data);
        return new Response(html, {
          headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders }
        });
      }

      case 'exportJson': {
        const data = await getData(env.BOOKMARKS_KV);
        return new Response(JSON.stringify(data, null, 2), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // ── Regenerate index.html + GitHub Sync ────────────────────
      case 'regenerate': {
        const token = getTokenFromRequest(request);
        if (!token || !await verifyToken(token, env.AUTH_SECRET)) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
        const data = await getData(env.BOOKMARKS_KV);
        const html = generateIndexHtml(data);
        const sha = await syncToGitHub(env, html);
        result = { success: true, sha };
        break;
      }

      default:
        return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
          status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal error' }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};
