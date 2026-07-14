/**
 * 对话附件上传：txt / 代码 / PDF / docx 解析与提示词拼装
 */
(function () {
    'use strict';

    const CHAT_DOC_MAX_FILES = 5;
    const CHAT_DOC_MAX_BYTES = 10 * 1024 * 1024;
    const CHAT_DOC_MAX_CHARS = 120000;

    const TEXT_EXTENSIONS = new Set([
        'txt', 'md', 'markdown', 'json', 'xml', 'csv', 'log', 'yml', 'yaml',
        'js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp', 'h', 'hpp', 'cs',
        'go', 'rs', 'php', 'rb', 'swift', 'kt', 'sql', 'sh', 'bat', 'ps1',
        'html', 'css', 'scss', 'less', 'vue', 'svelte'
    ]);

    const TEXT_MIME_PREFIXES = ['text/'];
    const TEXT_MIME_EXACT = new Set([
        'application/json',
        'application/xml',
        'application/javascript',
        'application/x-javascript',
    ]);

    function getExtension(name) {
        const idx = String(name || '').lastIndexOf('.');
        return idx >= 0 ? name.slice(idx + 1).toLowerCase() : '';
    }

    function formatFileSize(bytes) {
        const n = Number(bytes) || 0;
        if (n < 1024) return `${n} B`;
        if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
        return `${(n / (1024 * 1024)).toFixed(1)} MB`;
    }

    function isAcceptedDocumentFile(file) {
        if (!file) return false;
        const ext = getExtension(file.name);
        if (ext === 'pdf' || ext === 'docx' || ext === 'doc') return true;
        if (TEXT_EXTENSIONS.has(ext)) return true;
        const type = String(file.type || '').toLowerCase();
        if (TEXT_MIME_EXACT.has(type)) return true;
        return TEXT_MIME_PREFIXES.some(prefix => type.startsWith(prefix));
    }

    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error(`无法读取文件：${file.name}`));
            reader.readAsText(file, 'utf-8');
        });
    }

    function readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error(`无法读取文件：${file.name}`));
            reader.readAsArrayBuffer(file);
        });
    }

    function loadScriptOnce(src, globalName) {
        if (globalName && window[globalName]) return Promise.resolve(window[globalName]);
        const existing = document.querySelector(`script[data-src="${src}"]`);
        if (existing) {
            return new Promise((resolve, reject) => {
                existing.addEventListener('load', () => resolve(globalName ? window[globalName] : true));
                existing.addEventListener('error', () => reject(new Error(`脚本加载失败：${src}`)));
            });
        }
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.dataset.src = src;
            script.onload = () => resolve(globalName ? window[globalName] : true);
            script.onerror = () => reject(new Error(`脚本加载失败：${src}`));
            document.head.appendChild(script);
        });
    }

    async function parsePdfText(file) {
        await loadScriptOnce('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js', 'pdfjsLib');
        const pdfjsLib = window.pdfjsLib;
        if (pdfjsLib?.GlobalWorkerOptions) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
        }
        const buffer = await readFileAsArrayBuffer(file);
        const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
        const parts = [];
        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const content = await page.getTextContent();
            const text = content.items.map(item => item.str || '').join(' ').trim();
            if (text) parts.push(text);
        }
        return parts.join('\n\n');
    }

    async function parseDocxText(file) {
        await loadScriptOnce('https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js', 'mammoth');
        const buffer = await readFileAsArrayBuffer(file);
        const result = await window.mammoth.extractRawText({ arrayBuffer: buffer });
        return String(result?.value || '');
    }

    function detectKind(file, ext) {
        if (ext === 'pdf') return 'pdf';
        if (ext === 'docx' || ext === 'doc') return 'docx';
        return 'text';
    }

    function trimDocumentText(text) {
        const raw = String(text || '').replace(/\r\n/g, '\n').trim();
        if (raw.length <= CHAT_DOC_MAX_CHARS) {
            return { text: raw, truncated: false, charCount: raw.length };
        }
        const clipped = raw.slice(0, CHAT_DOC_MAX_CHARS);
        return {
            text: clipped + '\n\n[文档内容过长，已截断]',
            truncated: true,
            charCount: clipped.length,
        };
    }

    async function parseChatDocumentFile(file) {
        if (!isAcceptedDocumentFile(file)) {
            throw new Error(`不支持的文件类型：${file.name}`);
        }
        const ext = getExtension(file.name);
        const kind = detectKind(file, ext);
        let text = '';
        if (kind === 'pdf') text = await parsePdfText(file);
        else if (kind === 'docx') text = await parseDocxText(file);
        else text = await readFileAsText(file);

        const trimmed = trimDocumentText(text);
        if (!trimmed.text) throw new Error(`文件内容为空：${file.name}`);

        return {
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: file.name,
            kind,
            text: trimmed.text,
            ready: true,
            size: file.size,
            charCount: trimmed.charCount,
            truncated: trimmed.truncated,
        };
    }

    function buildDocumentsPromptPrefix(documentsSnapshot, message) {
        const docs = Array.isArray(documentsSnapshot) ? documentsSnapshot : [];
        const lines = [`【附件文档 · 共 ${docs.length} 个】`];
        docs.forEach((doc, index) => {
            lines.push(
                '',
                `--- 文档 ${index + 1}：${doc.name}（${formatFileSize(doc.size)}，约 ${Number(doc.charCount || 0).toLocaleString()} 字${doc.truncated ? '，已截断' : ''}）---`,
                String(doc.text || '').trim()
            );
        });
        const userMsg = String(message || '').trim();
        if (userMsg) {
            lines.push('', '【用户问题】', userMsg);
        } else {
            lines.push('', '【用户要求】', '请阅读以上附件文档，提炼要点并给出清晰、有条理的回答。');
        }
        return lines.join('\n');
    }

    function getDocumentSystemAddon() {
        return ' 当用户提供文档附件时，请基于文档正文作答，引用关键信息，结构清晰；若文档与问题无关，请明确说明。';
    }

    window.ChatFileUpload = {
        CHAT_DOC_MAX_FILES,
        CHAT_DOC_MAX_BYTES,
        CHAT_DOC_MAX_CHARS,
        formatFileSize,
        isAcceptedDocumentFile,
        parseChatDocumentFile,
        buildDocumentsPromptPrefix,
        getDocumentSystemAddon,
    };
})();
