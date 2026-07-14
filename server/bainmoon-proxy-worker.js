/**
 * Cloudflare Worker：百言辰月 API 反向代理
 *
 * 部署到 api.tmxkcy.xyz 后，在 script-writing.html 中设置：
 *   const BAINMOON_REMOTE_PROXY = 'https://api.tmxkcy.xyz/proxy/bainmoon';
 *
 * 部署步骤（Cloudflare Dashboard）：
 * 1. Workers → Create → 粘贴本文件内容
 * 2. 添加路由：api.tmxkcy.xyz/proxy/bainmoon*
 * 3. 或使用 wrangler：wrangler deploy
 */
const BAINMOON_ORIGIN = 'https://studio-zsz1314520-bainmoon-chat.api-inference.modelscope.net';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    if (!url.pathname.startsWith('/proxy/bainmoon')) {
      return new Response('Bainmoon proxy: use /proxy/bainmoon/gradio_api/...', { status: 404, headers: CORS });
    }

    const targetPath = url.pathname.replace(/^\/proxy\/bainmoon/, '') + url.search;
    const targetUrl = BAINMOON_ORIGIN + targetPath;

    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.delete('origin');
    headers.delete('referer');

    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    });

    const out = new Headers(upstream.headers);
    Object.entries(CORS).forEach(([k, v]) => out.set(k, v));

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: out,
    });
  },
};
