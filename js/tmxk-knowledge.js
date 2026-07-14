/**
 * 天马行空创意网 · 站内知识库（注入 AI 系统提示词）
 */
(function () {
    'use strict';

    const BASE_INSTRUCTION = '你是天马行空创意网 AI 小助手，帮助用户处理图片、文本、代码与文档创作。回答应准确、实用，必要时使用 Markdown 排版。';

    const KNOWLEDGE_ENTRIES = [
        {
            keywords: ['百言辰月', 'bainmoon', 'modelscope', '魔搭', '免配置'],
            text: '百言辰月是团队自训练模型（0.5B），选择 ① 百言辰月即可使用，已内置 ModelScope Token。支持对话、识图、文档、剧本、PPT/Word。视频/音乐/图片生成需切换 ② 自有 API 或 ③ App。',
        },
        {
            keywords: ['剧本', '分镜', '微电影', '短片', '口播', '脚本'],
            text: '剧本创作模式支持微电影/短片/短视频/分镜/口播等类型，可设置时长与风格，输出标准剧本结构，支持导出 Word 与分享。',
        },
        {
            keywords: ['ppt', '演示', '幻灯片', '大纲'],
            text: 'PPT 模式可生成演示大纲与结构，支持主题配色与导出；请按页组织标题与要点。',
        },
        {
            keywords: ['word', '文档', '报告'],
            text: 'Word/文档模式适合撰写报告、方案、说明文，支持 Markdown 结构与导出。',
        },
        {
            keywords: ['识图', '图片', 'vision', '看图'],
            text: '对话支持上传图片识图分析；百言辰月会将图片信息转为文本提示，自有 API 可走多模态 image_url。',
        },
        {
            keywords: ['api', '361', '密钥', 'token', '配置'],
            text: '② 自有 API 需在模型设置填写 API Key 与基础地址（如 https://www.361api.com），对话走 /v1/chat/completions。③ App 免配置。',
        },
        {
            keywords: ['视频', '音乐', '生成图片', '绘图'],
            text: '视频生成、音乐生成、AI 绘图需使用 ② 自有 API 或下载 App（③），百言辰月路径不支持这些媒体生成功能。',
        },
    ];

    function normalizeQuery(query) {
        return String(query || '').toLowerCase();
    }

    function scoreEntry(entry, query) {
        if (!query) return 0;
        let score = 0;
        for (const kw of entry.keywords) {
            if (query.includes(String(kw).toLowerCase())) score += 2;
        }
        return score;
    }

    function getKnowledgeInstruction() {
        return BASE_INSTRUCTION;
    }

    function buildSystemKnowledgeAddon(query) {
        const q = normalizeQuery(query);
        if (!q) return '';

        const matched = KNOWLEDGE_ENTRIES
            .map(entry => ({ entry, score: scoreEntry(entry, q) }))
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 2)
            .map(item => item.entry.text);

        if (!matched.length) return '';
        return '\n\n【站内知识参考】\n' + matched.map((t, i) => `${i + 1}. ${t}`).join('\n');
    }

    window.TMXKKnowledge = {
        getKnowledgeInstruction,
        buildSystemKnowledgeAddon,
        KNOWLEDGE_ENTRIES,
    };
})();
