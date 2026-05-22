// ═══ KalaSpace Navigator — Cloudflare Workers API ═══
// Handles /api/* routes. Static files served by Workers Sites.
// Adapted from functions/api/index.ts

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function uuid() {
  return 'bm-' + crypto.randomUUID().slice(0, 8);
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function extractDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url.split('/')[2] || url;
  }
}

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacSha256(key, msg) {
  const keyBuf = await crypto.subtle.importKey('raw', new TextEncoder().encode(key),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', keyBuf, new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function b64url(data) {
  return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function createToken(secret) {
  const exp = Math.floor(Date.now() / 1000) + 86400;
  const payload = b64url(JSON.stringify({ exp }));
  const sig = await hmacSha256(secret, payload);
  return payload + '.' + sig;
}

async function verifyToken(token, secret) {
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

function getTokenFromRequest(req) {
  const cookie = req.headers.get('Cookie') || '';
  const match = cookie.match(/kalaspace_token=([^;]+)/);
  return match ? match[1] : null;
}

async function getData(kv) {
  const raw = await kv.get('bookmarks_data');
  if (!raw) throw new Error('No bookmark data found. Please initialize first.');
  return JSON.parse(raw);
}

async function setData(kv, data) {
  data.lastModified = new Date().toISOString();
  await kv.put('bookmarks_data', JSON.stringify(data));
}

async function getAuth(kv) {
  const raw = await kv.get('bookmarks_auth');
  if (!raw) throw new Error('Not initialized');
  return JSON.parse(raw);
}

function generateIndexHtml(data) {
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

async function syncToGitHub(env, content) {
  const api = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/index.html`;

  // Get current SHA
  const getRes = await fetch(api, {
    headers: {
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'User-Agent': 'KalaSpace-Bot'
    }
  });
  const getData = await getRes.json();
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
  const putData = await putRes.json();
  return putData.commit.sha;
}

function parseChromeBookmarks(html) {
  const result = [];

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

function parseChromeFolders(html) {
  const folders = [];

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

function parseCurrentIndexHtml(html) {
  const data = { version: 1, lastModified: new Date().toISOString(), categories: [] };

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
    const subs = [];
    const subRegex = /<div class="sub-section" id="section-\d+-([^"]*)"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi;
    let subMatch;

    while ((subMatch = subRegex.exec(sectionHtml)) !== null) {
      const subHtml = subMatch[0];
      const subId = subMatch[1];

      const subNameMatch = subHtml.match(/<h3>([^<]*)<\/h3>/);
      const subName = subNameMatch ? subNameMatch[1] : subId;

      // Parse bookmark cards
      const bookmarks = [];
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

function exportToChromeHtml(data) {
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


// ═══ API Handler ═══
async function handleApi(request, env) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  const { action } = body;

  try {
    let result;

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
        const { ids } = body;
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
            const newOrder = items.map((i) => sub.bookmarks.find(b => b.id === i.id)).filter(Boolean);
            sub.bookmarks = newOrder;
          }
        } else if (type === 'subcategory') {
          const { categoryId } = body;
          const cat = data.categories.find(c => c.id === categoryId);
          if (cat) {
            const newOrder = items.map((i) => cat.subCategories.find(s => s.id === i.id)).filter(Boolean);
            cat.subCategories = newOrder;
          }
        } else if (type === 'category') {
          const newOrder = items.map((i) => data.categories.find(c => c.id === i.id)).filter(Boolean);
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
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Internal error' }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// ═══ Main Fetch Handler ═══
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API routes
    if (url.pathname === '/api/bookmarks' || url.pathname === '/api') {
      return handleApi(request, env);
    }

    // Everything else: Workers Sites will handle static files
    return new Response('Not Found', { status: 404 });
  }
};
