import re

with open('chrome书签.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取文件夹和书签
folders = []
h3_positions = [(m.start(), m.group(1)) for m in re.finditer(r'<DT><H3[^>]*>([^<]+)</H3>', content)]
h3_positions.append((len(content), None))

for i in range(len(h3_positions) - 1):
    folder_name = h3_positions[i][1].strip()
    start = h3_positions[i][0]
    end = h3_positions[i + 1][0]
    section = content[start:end]
    
    links = re.findall(r'<DT><A[^>]*HREF="([^"]*)"[^>]*>([^<]*)</A>', section)
    if folder_name and links:
        bookmarks = []
        for href, title in links:
            if href and title.strip():
                bookmarks.append({
                    'href': href.strip(),
                    'title': title.strip()
                })
        if bookmarks:
            folders.append({
                'name': folder_name,
                'id': f"section-{i}",
                'bookmarks': bookmarks
            })

# 生成HTML - CSS部分
css = '''
    :root {
      --bg-primary: #0a0e17;
      --bg-secondary: #111827;
      --bg-card: #1a2235;
      --text-primary: #e4e8ef;
      --text-secondary: #8892a6;
      --accent-green: #00d4aa;
      --accent-red: #ff4757;
      --accent-purple: #a55eea;
      --accent-blue: #3b82f6;
      --border-color: #2a3548;
      --sidebar-width: 260px;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Noto Sans SC', 'JetBrains Mono', sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      min-height: 100vh;
    }
    
    .header {
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      padding: 0 20px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .header-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--text-primary);
    }
    
    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--accent-green), var(--accent-blue));
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    .logo-text {
      font-size: 1.3rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--accent-green), var(--accent-blue));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .site-nav {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .site-nav a {
      padding: 8px 16px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.85rem;
      font-family: 'JetBrains Mono', monospace;
      transition: all 0.2s;
    }
    
    .site-nav a:hover {
      border-color: var(--accent-green);
      color: var(--accent-green);
      background: rgba(0, 212, 170, 0.1);
    }
    
    .site-nav a.active {
      border-color: var(--accent-green);
      color: var(--accent-green);
    }
    
    .search-box {
      max-width: 1400px;
      margin: 20px auto;
      padding: 0 20px;
    }
    
    .search-box input {
      width: 100%;
      padding: 15px 20px;
      padding-left: 50px;
      font-size: 1rem;
      background: var(--bg-card);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      color: var(--text-primary);
      font-family: inherit;
      transition: all 0.3s;
    }
    
    .search-box input:focus {
      outline: none;
      border-color: var(--accent-green);
      box-shadow: 0 0 30px rgba(0, 212, 170, 0.1);
    }
    
    .search-wrapper { position: relative; }
    .search-wrapper::before {
      content: '🔍';
      position: absolute;
      left: 18px;
      top: 50%;
      transform: translateY(-50%);
    }
    
    .main-container {
      display: flex;
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
      gap: 20px;
    }
    
    .sidebar {
      width: var(--sidebar-width);
      flex-shrink: 0;
      position: sticky;
      top: 80px;
      height: fit-content;
      max-height: calc(100vh - 100px);
      overflow-y: auto;
      background: var(--bg-secondary);
      border-radius: 12px;
      border: 1px solid var(--border-color);
      padding: 15px;
    }
    
    .sidebar::-webkit-scrollbar { width: 6px; }
    .sidebar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 3px; }
    
    .sidebar-title {
      font-size: 0.8rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
      padding-left: 10px;
    }
    
    .folder-list { list-style: none; }
    
    .folder-item { margin-bottom: 5px; }
    
    .folder-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    
    .folder-link:hover {
      background: var(--bg-card);
      color: var(--text-primary);
    }
    
    .folder-link.active {
      background: rgba(0, 212, 170, 0.1);
      color: var(--accent-green);
    }
    
    .folder-link .icon {
      font-size: 1.1rem;
      width: 24px;
      text-align: center;
    }
    
    .folder-link .count {
      margin-left: auto;
      font-size: 0.75rem;
      color: var(--text-secondary);
      background: var(--bg-card);
      padding: 2px 8px;
      border-radius: 10px;
    }
    
    .content { flex: 1; min-width: 0; }
    
    .stats {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    
    .stat-item {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 15px 25px;
      text-align: center;
    }
    
    .stat-value {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--accent-green);
      font-family: 'JetBrains Mono', monospace;
    }
    
    .stat-label {
      color: var(--text-secondary);
      font-size: 0.8rem;
      margin-top: 5px;
    }
    
    .bookmark-section {
      margin-bottom: 40px;
      scroll-margin-top: 100px;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid var(--border-color);
    }
    
    .section-header h2 {
      font-size: 1.3rem;
      color: var(--text-primary);
    }
    
    .section-header .count {
      color: var(--accent-green);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
    }
    
    .bookmark-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }
    
    .bookmark-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 15px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      text-decoration: none;
      color: var(--text-primary);
      transition: all 0.2s;
    }
    
    .bookmark-card:hover {
      transform: translateY(-2px);
      border-color: var(--accent-green);
      box-shadow: 0 8px 25px rgba(0, 212, 170, 0.1);
    }
    
    .bookmark-icon {
      width: 36px;
      height: 36px;
      background: var(--bg-secondary);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }
    
    .bookmark-info { flex: 1; min-width: 0; }
    
    .bookmark-title {
      font-size: 0.9rem;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .bookmark-url {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-family: 'JetBrains Mono', monospace;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    footer {
      text-align: center;
      padding: 40px 20px;
      border-top: 1px solid var(--border-color);
      margin-top: 60px;
    }
    
    footer p {
      color: var(--text-secondary);
      font-size: 0.85rem;
    }
    
    footer a {
      color: var(--accent-green);
      text-decoration: none;
    }
    
    @media (max-width: 900px) {
      .sidebar { display: none; }
      .site-nav { display: none; }
      .header-inner { justify-content: center; }
    }
    
    @media (max-width: 600px) {
      .bookmark-grid { grid-template-columns: 1fr; }
      .main-container { padding: 15px; }
    }
'''

html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KalaSpace - 安全导航</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛡️</text></svg>">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap');
    {css}
  </style>
</head>
<body>
  <header class="header">
    <div class="header-inner">
      <a href="#" class="logo">
        <div class="logo-icon">🛡️</div>
        <span class="logo-text">KalaSpace</span>
      </a>
      <nav class="site-nav">
        <a href="https://kalaspace.dpdns.org" class="active">导航首页</a>
        <a href="https://blog.kalaspace.dpdns.org">安全知识库</a>
        <a href="https://github.com/qwerasdzx-123" target="_blank">GitHub</a>
      </nav>
    </div>
  </header>
  
  <div class="search-box">
    <div class="search-wrapper">
      <input type="text" id="searchInput" placeholder="搜索书签... (Ctrl+K)">
    </div>
  </div>
  
  <div class="main-container">
    <aside class="sidebar">
      <div class="sidebar-title">📁 文件夹导航</div>
      <ul class="folder-list">
'''

# 添加侧边栏
for folder in folders:
    icons = {
        "AI": "🤖", "人工智能": "🤖",
        "hack": "💀", "渗透": "💀", "黑客": "💀",
        "CTF": "🎯", "靶场": "🎯",
        "社交": "💬", "telegram": "💬",
        "服务器": "☁️", "云": "☁️",
        "github": "🐙",
        "工具": "🛠️",
        "学习": "📚", "知识": "📚",
        "新闻": "📰", "资料": "📰",
        "加密": "🔐", "解密": "🔐",
        "VPN": "🌐", "vpn": "🌐",
    }
    icon = "📂"
    for key, val in icons.items():
        if key in folder['name']:
            icon = val
            break
    
    html += f'''        <li class="folder-item">
          <a href="#{folder['id']}" class="folder-link">
            <span class="icon">{icon}</span>
            <span class="name">{folder['name']}</span>
            <span class="count">{len(folder['bookmarks'])}</span>
          </a>
        </li>
'''

html += '''      </ul>
    </aside>
    
    <main class="content">
      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">''' + str(len(folders)) + '''</div>
          <div class="stat-label">分类</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">''' + str(sum(len(f['bookmarks']) for f in folders)) + '''</div>
          <div class="stat-label">书签</div>
        </div>
      </div>
'''

# 添加书签区块
for folder in folders:
    html += f'''      <section id="{folder['id']}" class="bookmark-section">
        <div class="section-header">
          <h2>📂 {folder['name']}</h2>
          <span class="count">{len(folder['bookmarks'])} 个</span>
        </div>
        <div class="bookmark-grid">
'''
    
    for bookmark in folder['bookmarks']:
        icon = "🔗"
        href = bookmark['href'].lower()
        if "github" in href:
            icon = "🐙"
        elif "twitter" in href or "x.com" in href:
            icon = "𝕏"
        elif "telegram" in href:
            icon = "✈️"
        elif "youtube" in href:
            icon = "▶️"
        elif "cloudflare" in href:
            icon = "☁️"
        elif "ai" in href or "chat" in href:
            icon = "🤖"
        
        url = bookmark['href']
        if url.startswith('https://'):
            url = url[8:]
        elif url.startswith('http://'):
            url = url[7:]
        url = url.split('/')[0]
        
        title = bookmark['title']
        if len(title) > 40:
            title = title[:40] + '...'
        
        html += f'''          <a href="{bookmark['href']}" class="bookmark-card" target="_blank">
            <div class="bookmark-icon">{icon}</div>
            <div class="bookmark-info">
              <div class="bookmark-title">{title}</div>
              <div class="bookmark-url">{url}</div>
            </div>
          </a>
'''
    
    html += '''        </div>
      </section>
'''

html += '''    </main>
  </div>
  
  <footer>
    <p>Built with 🛡️ by <a href="https://blog.kalaspace.dpdns.org">KalaSpace</a> · Powered by Cloudflare Pages</p>
    <p style="margin-top: 10px; opacity: 0.7;">// 探索 · 研究 · 分享</p>
  </footer>
  
  <script>
    document.getElementById('searchInput').addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase();
      const sections = document.querySelectorAll('.bookmark-section');
      
      if (query.length === 0) {
        sections.forEach(s => s.style.display = 'block');
        document.querySelectorAll('.bookmark-card').forEach(c => c.style.display = 'flex');
        return;
      }
      
      sections.forEach(section => {
        const cards = section.querySelectorAll('.bookmark-card');
        let hasResults = false;
        cards.forEach(card => {
          const title = card.querySelector('.bookmark-title').textContent.toLowerCase();
          const url = card.querySelector('.bookmark-url').textContent.toLowerCase();
          if (title.includes(query) || url.includes(query)) {
            card.style.display = 'flex';
            hasResults = true;
          } else {
            card.style.display = 'none';
          }
        });
        section.style.display = hasResults ? 'block' : 'none';
      });
    });
    
    const folderLinks = document.querySelectorAll('.folder-link');
    const sections = document.querySelectorAll('.bookmark-section');
    
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 200) {
          current = section.getAttribute('id');
        }
      });
      folderLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
    
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
      }
    });
  </script>
</body>
</html>
'''

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ 导航页面已生成！")
print(f"   - {len(folders)} 个分类")
print(f"   - {sum(len(f['bookmarks']) for f in folders)} 个书签")
