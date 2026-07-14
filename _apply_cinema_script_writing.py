import re
from pathlib import Path

path = Path(r'd:\项目1\tmxk\script-writing.html')
content = path.read_text(encoding='utf-8')

content = content.replace(
    '<meta name="theme-color" content="#0a2040">',
    '<meta name="theme-color" content="#6366f1">'
)

fonts_block = '''    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;700;900&display=swap" rel="stylesheet">'''
if 'family=Syne' not in content:
    content = content.replace(
        '<link rel="icon" href="photo/AI.png" type="image/png">',
        '<link rel="icon" href="photo/AI.png" type="image/png">\n' + fonts_block
    )

old_root = '''        :root {
            --primary: #0b63ff;
            --primary-hover: #3a86ff;
            --radius: 16px;
            --radius-sm: 8px;
            --radius-lg: 24px;
            --shadow-sm: 0 2px 8px rgba(0,0,0,0.1);
            --shadow-md: 0 4px 16px rgba(0,0,0,0.12);
            --shadow-lg: 0 8px 32px rgba(0,0,0,0.15);
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            --gradient-primary: linear-gradient(135deg, #0b63ff 0%, #3a86ff 100%);
            --gradient-brand: linear-gradient(135deg, #615ced 0%, #0b63ff 45%, #00e5ff 100%);
            --gradient-brand-soft: linear-gradient(135deg, rgba(97, 92, 237, 0.12) 0%, rgba(11, 99, 255, 0.08) 50%, rgba(0, 229, 255, 0.06) 100%);
            --gradient-mesh: radial-gradient(ellipse 80% 60% at 20% 10%, rgba(97, 92, 237, 0.14), transparent 50%), radial-gradient(ellipse 70% 50% at 85% 90%, rgba(11, 99, 255, 0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 50% 50%, rgba(0, 229, 255, 0.06), transparent 60%);
            --anim-smooth: cubic-bezier(0.4, 0, 0.2, 1);
            --anim-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
            --bg-primary: #ffffff;
            --bg-secondary: #f8f9fa;
            --bg-tertiary: #e9ecef;
            --text-primary: #1f2937;
            --text-secondary: #6b7280;
            --text-muted: #9ca3af;
            --border-color: #e5e7eb;
            --accent-cyan: #00e5ff;
            --accent-purple: #7c3aed;
            --glow-cyan: 0 0 20px rgba(0, 229, 255, 0.35);
            --glow-blue: 0 0 30px rgba(11, 99, 255, 0.25);
            --glass-bg: rgba(255, 255, 255, 0.72);
            --glass-border: rgba(11, 99, 255, 0.18);
            --tech-grid: rgba(11, 99, 255, 0.04);
            --success: #34a853;
            --danger: #ea4335;
        }'''

new_root = '''        :root {
            --primary: #6366f1;
            --primary-hover: #4f46e5;
            --secondary: #525866;
            --success: #10b981;
            --danger: #ef4444;
            --warning: #f59e0b;
            --info: #06b6d4;
            --radius: 16px;
            --radius-sm: 10px;
            --radius-lg: 24px;
            --shadow-sm: 0 4px 16px rgba(20,24,36,.06);
            --shadow-md: 0 8px 32px rgba(20,24,36,.08);
            --shadow-lg: 0 24px 64px rgba(99,102,241,.18);
            --shadow-xl: 0 32px 80px rgba(99,102,241,.22);
            --transition: all 0.35s cubic-bezier(.4,0,.2,1);
            --ease-expo: cubic-bezier(.16,1,.3,1);
            --focus-color: var(--primary);
            --grad-brand-vivid: linear-gradient(125deg, #1e1b4b 0%, #3730a3 8%, #4f46e5 20%, #6366f1 32%, #8b5cf6 44%, #c084fc 52%, #e879f9 58%, #06b6d4 72%, #22d3ee 84%, #67e8f9 92%, #818cf8 100%);
            --grad-mesh: radial-gradient(ellipse 90% 60% at 15% 10%, rgba(99,102,241,.14), transparent 55%), radial-gradient(ellipse 70% 50% at 85% 15%, rgba(34,211,238,.1), transparent 50%), radial-gradient(ellipse 60% 55% at 70% 85%, rgba(168,85,247,.09), transparent 52%), #f4f6fc;
            --grad-hero: radial-gradient(ellipse 110% 85% at 50% -28%, rgba(99,102,241,.55), transparent 58%), radial-gradient(ellipse 65% 55% at 98% 8%, rgba(34,211,238,.32), transparent 52%), radial-gradient(ellipse 55% 48% at -5% 28%, rgba(139,92,246,.3), transparent 50%);
            --gradient-primary: var(--grad-brand-vivid);
            --gradient-brand: var(--grad-brand-vivid);
            --gradient-brand-soft: linear-gradient(135deg, rgba(99,102,241,.12) 0%, rgba(139,92,246,.08) 50%, rgba(34,211,238,.06) 100%);
            --gradient-mesh: var(--grad-mesh);
            --anim-smooth: cubic-bezier(0.4, 0, 0.2, 1);
            --anim-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
            --bg-primary: #ffffff;
            --bg-secondary: #f4f6fc;
            --bg-tertiary: #eef2ff;
            --text-primary: #141824;
            --text-secondary: #525866;
            --text-muted: #8b93a3;
            --border-color: #e4e9f2;
            --accent-cyan: #22d3ee;
            --accent-purple: #8b5cf6;
            --primary-glow: rgba(99,102,241,.45);
            --primary-soft: #eef2ff;
            --glow-cyan: 0 0 20px rgba(34,211,238,.35);
            --glow-blue: 0 0 30px rgba(99,102,241,.25);
            --glass-bg: rgba(255,255,255,.72);
            --glass-border: rgba(99,102,241,.18);
            --glass-inset: rgba(255,255,255,.9);
            --panel-glass: rgba(255,255,255,.75);
            --tech-grid: rgba(99,102,241,.04);
            --font-display: 'Syne', 'Noto Sans SC', sans-serif;
            --font-body: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
            --font-mono: 'IBM Plex Mono', 'Consolas', 'Noto Sans SC', ui-monospace, monospace;
            --font: var(--font-body);
        }'''

if old_root in content:
    content = content.replace(old_root, new_root)
else:
    print('WARN: :root block not found')

old_dark = '''        [data-theme="dark"] {
            --primary: #3a86ff;
            --bg-primary: #111827;
            --bg-secondary: #1f2937;
            --bg-tertiary: #374151;
            --text-primary: #f9fafb;
            --text-secondary: #d1d5db;
            --text-muted: #9ca3af;
            --border-color: #374151;
            --glass-bg: rgba(17, 24, 39, 0.82);
            --glass-border: rgba(0, 229, 255, 0.22);
            --tech-grid: rgba(58, 134, 255, 0.08);
            --glow-cyan: 0 0 24px rgba(0, 229, 255, 0.4);
            --glow-blue: 0 0 40px rgba(58, 134, 255, 0.35);
        }'''

new_dark = '''        [data-theme="dark"] {
            --primary: #818cf8;
            --primary-hover: #6366f1;
            --bg-primary: #0f1524;
            --bg-secondary: #060a14;
            --bg-tertiary: #111827;
            --text-primary: #f1f5f9;
            --text-secondary: rgba(226,232,240,.82);
            --text-muted: rgba(148,163,184,.78);
            --border-color: rgba(99,102,241,.24);
            --glass-bg: rgba(8,12,24,.84);
            --glass-border: rgba(99,102,241,.28);
            --glass-inset: rgba(255,255,255,.08);
            --panel-glass: rgba(12,18,32,.88);
            --primary-soft: rgba(99,102,241,.2);
            --tech-grid: rgba(99,102,241,.08);
            --glow-cyan: 0 0 24px rgba(34,211,238,.4);
            --glow-blue: 0 0 40px rgba(99,102,241,.35);
            --grad-mesh: radial-gradient(ellipse 90% 60% at 15% 10%, rgba(99,102,241,.24), transparent 55%), radial-gradient(ellipse 70% 50% at 85% 15%, rgba(34,211,238,.16), transparent 50%), #060a14;
        }'''

if old_dark in content:
    content = content.replace(old_dark, new_dark)

old_body = '''        body {
            font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
            background-color: var(--bg-secondary);
            background-image:
                var(--gradient-mesh),
                linear-gradient(var(--tech-grid) 1px, transparent 1px),
                linear-gradient(90deg, var(--tech-grid) 1px, transparent 1px);
            background-size: 200% 200%, 44px 44px, 44px 44px;
            background-attachment: fixed;
            animation: systemMeshFlow 18s ease-in-out infinite;
            color: var(--text-primary);
            transition: background-color var(--transition), color var(--transition);
            line-height: 1.6;
        }'''

new_body = '''        body.page-cinema {
            font-family: var(--font);
            background: var(--grad-mesh);
            background-attachment: fixed;
            color: var(--text-primary);
            line-height: 1.65;
            -webkit-font-smoothing: antialiased;
            overflow-x: clip;
            transition: background-color var(--transition), color var(--transition);
        }'''

if old_body in content:
    content = content.replace(old_body, new_body)

marker = '/* ═══ Cinema shell (inline) ═══ */'
if marker not in content:
    exam = Path(r'd:\项目1\tmxk\exam-center.html').read_text(encoding='utf-8')
    start = exam.index(marker)
    end = exam.index('    </style>', start)
    cinema_css = exam[start:end]

    cinema_css = re.sub(
        r'\n        body\.page-cinema \.main-content \{ display: flex;.*?\n        \}',
        '',
        cinema_css,
        flags=re.DOTALL
    )
    cinema_css = re.sub(
        r'\n        body\.page-cinema \.sidebar \{.*?\n        \}',
        '',
        cinema_css,
        flags=re.DOTALL
    )
    cinema_css = re.sub(
        r'\n        body\.page-cinema \.content \{.*?\n        \}',
        '',
        cinema_css,
        flags=re.DOTALL
    )
    exam_core = cinema_css.find('/* ═══ Exam core modules (Cinema) ═══ */')
    media_start = cinema_css.find('@media (prefers-reduced-motion: reduce)', exam_core)
    if exam_core != -1 and media_start != -1:
        cinema_css = cinema_css[:exam_core] + cinema_css[media_start:]

    ai_overrides = '''

        /* ═══ AI Studio Cinema overrides ═══ */
        body.page-cinema.page-ai-studio .container.main-content {
            max-width: 1240px;
            margin-left: auto;
            margin-right: auto;
            display: block;
            padding: 0 clamp(16px, 3vw, 24px) 28px;
        }
        body.page-cinema .page-hero { max-width: 1240px; margin-left: auto; margin-right: auto; }
        body.page-cinema .page-hero-desc--tip { margin-top: -20px; margin-bottom: 28px; border-left-color: rgba(34,211,238,.45); font-size: .875rem; }
        body.page-cinema .page-hero-desc--tip a { color: var(--accent-cyan); text-decoration: none; font-weight: 600; }
        body.page-cinema .page-hero-desc--tip a:hover { text-decoration: underline; }
        body.page-cinema .watermark { color: rgba(99,102,241,.06); font-family: var(--font-display); }
        body.page-cinema .logo-ai-tag { display: none; }
        body.page-cinema .tmxk-ai-brand-name { background: var(--grad-brand-vivid); background-size: 300% 300%; animation: gradShift 7s ease infinite; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        body.page-cinema .tmxk-ai-brand-badge { background: var(--grad-brand-vivid); background-size: 300% 300%; animation: gradShift 6s ease infinite; box-shadow: 0 0 16px var(--primary-glow); border-color: rgba(255,255,255,.25); }
        body.page-cinema .tmxk-ai-brand-logo { border-color: rgba(99,102,241,.45); box-shadow: 0 0 20px rgba(99,102,241,.25); }
        body.page-cinema .ai-creator { background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); box-shadow: var(--shadow-md), inset 0 1px 0 var(--glass-inset); clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px)); border-radius: 0; }
        body.page-cinema .ai-tab-btn.active { background: var(--grad-brand-vivid) !important; background-size: 300% 300%; animation: gradShift 6s ease infinite; border-color: rgba(99,102,241,.45) !important; color: #fff !important; box-shadow: 0 4px 16px var(--primary-glow); }
        body.page-cinema .ai-tab-btn { font-family: var(--font-mono); letter-spacing: .04em; clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px)); border-radius: 0; }
        body.page-cinema .ai-community-btn--join { background: var(--grad-brand-vivid); background-size: 300% 300%; animation: gradShift 6s ease infinite; }
        body.page-cinema .chat-new-btn, body.page-cinema .chat-send-btn, body.page-cinema .chat-sidebar-tool-btn.active { background: var(--grad-brand-vivid); background-size: 300% 300%; animation: gradShift 6s ease infinite; }
        body.page-cinema .banner { display: none !important; }
        body.page-cinema .skip-link { font-family: var(--font-mono); font-size: 11px; letter-spacing: .08em; clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%); border-radius: 0; }
        body.chat-fullscreen-open #siteTop, body.chat-fullscreen-open .site-top-spacer, body.chat-fullscreen-open .scroll-progress, body.chat-fullscreen-open .ambient { display: none !important; }
        @media (max-width: 900px) { body.page-cinema .slogan { display: none; } }
        @media (max-width: 768px) { body.page-cinema .page-hero-stats { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .header-actions .search { display: none; } body.page-cinema .page-hero-stats { grid-template-columns: 1fr; } }
'''
    cinema_css = cinema_css.rstrip() + ai_overrides
    content = content.replace('    </style>', cinema_css + '\n    </style>', 1)

if "document.documentElement.classList.add('js')" not in content:
    content = content.replace('</head>', "    <script>document.documentElement.classList.add('js');</script>\n</head>", 1)

old_shell = '''<body class="page-ai-studio">
    <!-- 水印 -->
    <div class="watermark" id="siteWatermark" aria-hidden="true">天马行空创意网 AI</div>
    <header id="siteHeader">
        <div class="container header-content">
            <a href="index.html" class="logo" aria-label="天马行空创意网首页">
                <img src="photo/AI.png" alt="天马行空创意网 标志" width="56" height="56">
                <div>
                    <div class="logo-main">天马行空创意网<span class="logo-ai-tag">AI</span></div>
                    <div class="logo-sub">TianMa Creative Network · AI Studio</div>
                </div>
            </a>
            <div class="slogan">拥抱创意 点亮人生</div>
            <div class="header-tools">
                <div class="search">
                    <input type="search" placeholder="搜索..." aria-label="搜索网站内容">
                    <button type="button" class="search-btn" aria-label="搜索">🔍</button>
                </div>
                <button id="themeToggle" aria-label="切换主题">🌙</button>
            </div>
        </div>
    </header>
    
    <nav id="siteNav" aria-label="主导航">
        <div class="container">
            <ul>
                <li><a href="index.html">首页</a></li>
                <li>
                    <a href="about.html">关于我们</a>
                    <ul class="dropdown" aria-label="关于我们子菜单">
                        <li><a href="business-center.html">业务中心</a></li>
                        <li><a href="news.html">新闻动态</a></li>
                    </ul>
                </li>
                <li>
                    <a href="team-info.html" aria-haspopup="true">服务系统</a>
                    <ul class="dropdown" aria-label="服务系统子菜单">
                        <li><a href="team-info.html">团队档案信息查询系统</a></li>
                        <li><a href="exam-center.html">在线考试中心</a></li>
                        <li><a href="https://v.kaoshixing.com/exam/aiInterview/pc/#/list" target="_blank" rel="noopener noreferrer">团队考核系统</a></li>
                    </ul>
                </li>
                <li><a href="https://work.weixin.qq.com/wework_admin/frame#/index" target="_blank" rel="noopener noreferrer">工作系统</a></li>
                <li>
                    <a href="download-materials.html" aria-haspopup="true">下载专区</a>
                    <ul class="dropdown" aria-label="下载专区子菜单">
                        <li><a href="download-materials.html">资料</a></li>
                        <li><a href="download-software.html">软件</a></li>
                        <li><a href="#" onclick="openTmxkMobileAdModal(); return false;">手机版</a></li>
                    </ul>
                </li>
                <li><a href="video.html">视频区</a></li>
                <li><a href="script-writing.html" class="nav-active">AI创作</a></li>
            </ul>
        </div>
    </nav>
    
    <div class="banner" id="siteBanner">
        <div class="banner-grid" aria-hidden="true"></div>
        <div class="banner-scan" aria-hidden="true"></div>
        <div class="particles" id="particles-js"></div>
        <div class="container banner-content">
            <span class="tech-tag">TMXK · AI STUDIO · 官方创作平台</span>
            <h1>AI 创作中心</h1>
            <p>// 网页版 · 需自行配置 API · 对话 · 图片 · 视频 · 音乐</p>
            <p class="banner-app-tip">不想自己配置 API？<a href="mobile-app.html">下载 App 版</a>，注册登录即可使用</p>
        </div>
    </div>'''

new_shell = '''<body class="page-cinema page-ai-studio" data-nav-active="ai">
<div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div>
    <div class="ambient" aria-hidden="true">
        <div class="ambient-blob b1"></div>
        <div class="ambient-blob b2"></div>
        <div class="ambient-blob b3"></div>
        <div class="ambient-mesh"></div>
        <div class="ambient-grid"></div>
        <span class="ambient-spark s1"></span>
        <span class="ambient-spark s2"></span>
        <span class="ambient-spark s3"></span>
        <span class="ambient-spark s4"></span>
    </div>
    <div class="page-wrap">
    <div class="watermark" id="siteWatermark" aria-hidden="true">天马行空创意网 AI</div>
    <a href="#main" class="skip-link">跳至主要内容</a>
<div class="site-top" id="siteTop">
    <div class="site-top-shell">
    <header id="siteHeader">
        <div class="container header-content">
            <a href="index.html" class="logo" aria-label="天马行空创意网首页">
                <img src="photo/logo.png" alt="天马行空创意网 标志" width="50" height="50">
                <div>
                    <div class="logo-main">天马行空创意网</div>
                    <div class="logo-sub">TianMa Creative Network</div>
                </div>
            </a>
            <div class="slogan">拥抱创意 点亮人生</div>
            <div class="header-actions">
                <div class="search">
                    <input type="search" id="searchInput" placeholder="搜索..." aria-label="搜索网站内容">
                    <button type="button" class="search-btn" id="searchBtn" aria-label="搜索">🔍</button>
                </div>
                <button id="themeToggle" class="theme-btn-cinema" type="button" aria-label="切换主题">🌙</button>
                <a href="mobile-app.html" class="header-cta-cinema">AI App 下载</a>
            </div>
        </div>
    </header>
    <nav id="siteNav" aria-label="主导航" class="site-nav-exp">
        <div class="nav-exp-head">
            <span class="nav-exp-tag">NAV // SYSTEM</span>
            <span class="nav-exp-line" aria-hidden="true"></span>
        </div>
        <div class="container nav-scroll">
            <ul>
                <li><a href="index.html" data-nav-index="01" data-nav-key="home">首页</a></li>
                <li>
                    <a href="about.html" data-nav-index="02" data-nav-key="about">关于我们</a>
                    <ul class="dropdown" aria-label="关于我们子菜单">
                        <li><a href="business-center.html">业务中心</a></li>
                        <li><a href="news.html">新闻动态</a></li>
                    </ul>
                </li>
                <li>
                    <a href="team-info.html" aria-haspopup="true" data-nav-index="03" data-nav-key="services">服务系统</a>
                    <ul class="dropdown" aria-label="服务系统子菜单">
                        <li><a href="team-info.html">团队档案信息查询系统</a></li>
                        <li><a href="exam-center.html">在线考试中心</a></li>
                        <li><a href="https://v.kaoshixing.com/exam/aiInterview/pc/#/list" target="_blank" rel="noopener noreferrer">团队考核系统</a></li>
                    </ul>
                </li>
                <li><a href="https://work.weixin.qq.com/wework_admin/frame#/index" target="_blank" rel="noopener noreferrer" data-nav-index="04" data-nav-key="work">工作系统</a></li>
                <li>
                    <a href="download-materials.html" aria-haspopup="true" data-nav-index="05" data-nav-key="download">下载专区</a>
                    <ul class="dropdown" aria-label="下载专区子菜单">
                        <li><a href="download-materials.html">资料</a></li>
                        <li><a href="download-software.html">软件</a></li>
                    </ul>
                </li>
                <li><a href="video.html" data-nav-index="06" data-nav-key="video">视频区</a></li>
                <li><a href="script-writing.html" data-nav-index="07" data-nav-key="ai" class="nav-is-active">AI创作</a></li>
            </ul>
        </div>
    </nav>
    </div>
</div>
<div class="site-top-spacer" id="siteTopSpacer" aria-hidden="true"></div>

    <div class="page-hero" id="siteBanner">
        <div class="page-hero-scan" aria-hidden="true"></div>
        <div class="page-hero-corner page-hero-corner--tl" aria-hidden="true"></div>
        <div class="page-hero-corner page-hero-corner--br" aria-hidden="true"></div>
        <div class="page-hero-inner">
            <span class="page-hero-tag">AI // STUDIO</span>
            <h1 class="page-hero-title">AI<em>创作</em>中心</h1>
            <p class="page-hero-desc">网页版 · 需自行配置 API · 对话 · 图片 · 视频 · 音乐 · 剧本</p>
            <p class="page-hero-desc page-hero-desc--tip">不想自己配置 API？<a href="mobile-app.html">下载 App 版</a>，注册登录即可使用</p>
            <div class="page-hero-stats">
                <div class="page-hero-stat"><div class="page-hero-stat-val">6</div><div class="page-hero-stat-label">核心模块</div></div>
                <div class="page-hero-stat"><div class="page-hero-stat-val">5</div><div class="page-hero-stat-label">创作模式</div></div>
                <div class="page-hero-stat"><div class="page-hero-stat-val">API</div><div class="page-hero-stat-label">自主配置</div></div>
                <div class="page-hero-stat"><div class="page-hero-stat-val">∞</div><div class="page-hero-stat-label">创意可能</div></div>
            </div>
        </div>
    </div>'''

if old_shell in content:
    content = content.replace(old_shell, new_shell)
else:
    print('WARN: body shell not found')

if '</div><!-- /.page-wrap -->' not in content:
    content = content.replace(
        '    </footer>\n    \n    <!-- 加入我们弹窗 -->',
        '    </footer>\n    </div><!-- /.page-wrap -->\n    \n    <!-- 加入我们弹窗 -->'
    )

content = content.replace('    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>\n', '')

content = re.sub(
    r"\n        if \(typeof particlesJS !== 'undefined'.*?\n        \}\n",
    '\n',
    content,
    flags=re.DOTALL
)

old_theme = '''    <script src="js/search-common.js" defer></script>
    <script>
        (function() {
            const themeToggle = document.getElementById('themeToggle');
            if (!themeToggle) return;
            const html = document.documentElement;
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
            html.setAttribute('data-theme', initialTheme);
            
            function updateButtonIcon() {
                const currentTheme = html.getAttribute('data-theme');
                themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
                themeToggle.setAttribute('aria-label', currentTheme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
            }
            updateButtonIcon();
            
            themeToggle.addEventListener('click', () => {
                const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateButtonIcon();
            });
        })();
        
    </script>'''

new_theme = '''    <script>
    (function () {
        var saved = localStorage.getItem('theme');
        if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else if (saved === 'light') {
            document.documentElement.removeAttribute('data-theme');
        }
        var themeToggle = document.getElementById('themeToggle');
        function syncThemeBtn() {
            if (!themeToggle) return;
            var dark = document.documentElement.getAttribute('data-theme') === 'dark';
            themeToggle.textContent = dark ? '☀️' : '🌙';
            themeToggle.setAttribute('aria-label', dark ? '切换到浅色模式' : '切换到深色模式');
        }
        syncThemeBtn();
        if (themeToggle) {
            themeToggle.addEventListener('click', function () {
                var dark = document.documentElement.getAttribute('data-theme') === 'dark';
                if (dark) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('theme', 'light'); }
                else { document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem('theme', 'dark'); }
                syncThemeBtn();
            });
        }
        var navKey = document.body.getAttribute('data-nav-active');
        if (navKey) document.querySelectorAll('nav a[data-nav-key="' + navKey + '"]').forEach(function (a) { a.classList.add('nav-is-active'); });
        var siteTop = document.getElementById('siteTop');
        function syncSpacer() {
            var shell = siteTop && siteTop.querySelector('.site-top-shell');
            if (shell) document.documentElement.style.setProperty('--site-top-h', shell.offsetHeight + 'px');
        }
        syncSpacer();
        window.addEventListener('resize', syncSpacer, { passive: true });
        window.addEventListener('load', syncSpacer, { passive: true });
        if (window.ResizeObserver && siteTop) {
            var shell = siteTop.querySelector('.site-top-shell');
            if (shell) new ResizeObserver(syncSpacer).observe(shell);
        }
        var progress = document.getElementById('scrollProgress');
        var ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                var st = window.scrollY || document.documentElement.scrollTop;
                var dh = document.documentElement.scrollHeight - window.innerHeight;
                if (progress && dh > 0) progress.style.width = Math.min(100, (st / dh) * 100) + '%';
                ticking = false;
            });
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        var searchBtn = document.getElementById('searchBtn');
        var searchInput = document.getElementById('searchInput');
        function doSearch() { var q = (searchInput && searchInput.value || '').trim(); if (q) window.location.href = 'search.html?q=' + encodeURIComponent(q); }
        if (searchBtn) searchBtn.addEventListener('click', doSearch);
        if (searchInput) searchInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') doSearch(); });
    })();
    </script>'''

if old_theme in content:
    content = content.replace(old_theme, new_theme)
else:
    print('WARN: theme script block not found, trying fallback')
    if 'js/search-common.js' in content:
        content = content.replace('    <script src="js/search-common.js" defer></script>\n', '')

path.write_text(content, encoding='utf-8')
print('Done. Lines:', content.count('\n') + 1)
