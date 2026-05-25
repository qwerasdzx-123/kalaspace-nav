# 🔒 KalaSpace - 安全导航

> 极客风格书签导航站，为网络安全从业者和技术爱好者而生

[![Deployed on Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

<p align="center">
  <a href="https://kalaspace.dpdns.org">
    <img src="https://img.shields.io/badge/Live Demo-kalaspace.dpdns.org-00ff41?style=for-the-badge&logo=cloudflare&logoColor=00ff41" alt="Live Demo"/>
  </a>
</p>

---

## 📖 关于本站

**KalaSpace** 是一个个人维护的安全导航站，专注于整理网络安全、渗透测试、CTF、CTF 靶场、AI工具、实用工具等领域的常用链接。

### 主要功能

- 🔍 **实时搜索** — 快速定位书签，支持快捷键 `Ctrl+K`
- 📂 **多级分类** — 分类 > 子分类二级结构，层次清晰
- 🌙 **明暗主题** — 自适应 / 手动切换，护眼设计
- 🔗 **一键复制** — 点击链接图标直接复制 URL
- 📱 **响应式布局** — 移动端 / 桌面端均可良好体验
- 📊 **书签统计** — 实时显示分类与书签数量


## 📊 数据统计

| 指标 | 数量 |
|------|------|
| 分类 | 14 |
| 书签 | 418+ |
| 支持主题 | 明 / 黑 两种 |

## 🚀 技术栈

- **前端**：原生 HTML/CSS/JS，无框架依赖
- **后端**：Cloudflare Workers（Edge 部署，响应极快）
- **数据存储**：Cloudflare KV（全球化分布式存储）
- **图标**：Remix Icon
- **主题**：CSS Variables + 自研 Hacker/Terminal 风格配色

## 🛠️ 部署

```bash
# 1. 安装依赖
npm install

# 2. 登录 Cloudflare
npx wrangler login

# 3. 部署
npx wrangler deploy
```

## 💬 关注与联系

欢迎关注我的账号，有好玩的工具或网址欢迎私信投稿！

<p align="center">
  <a href="https://twitter.com/kalaspace002" target="_blank">
    <img src="https://img.shields.io/badge/-@kalaspace002-000?style=flat-square&logo=X&logoColor=white" alt="@kalaspace002"/>
  </a>
  &nbsp;
  <a href="https://github.com/qwerasdzx-123" target="_blank">
    <img src="https://img.shields.io/badge/-@qwerasdzx--123-000?style=flat-square&logo=GitHub&logoColor=white" alt="@qwerasdzx-123"/>
  </a>
  &nbsp;
  <a href="https://blog.kalaspace.dpdns.org/" target="_blank">
    <img src="https://img.shields.io/badge/Blog-kalaspace.dpdns.org-00ff41?style=flat-square&logo=cloudflare&logoColor=00ff41" alt="Blog"/>
  </a>
</p>

---

> 📢 **书签分享**：有好玩好用的链接？欢迎私信 [@kalaspace002](https://twitter.com/kalaspace002)，期待你的投稿！

---

## Embedded Timeline

<a class="twitter-tweet" href="https://twitter.com/kalaspace002/status/2058816772598616446">
没事情瞎做的书签分享网站，大家有什么好玩好用的链接可以私信我，加入书签分享哦 https://kalaspace.dpdns.org
</a>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
