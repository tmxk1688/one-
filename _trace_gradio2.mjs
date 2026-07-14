import { Client } from '@gradio/client';

const BASE = 'https://studio-zsz1314520-bainmoon-chat.api-inference.modelscope.net/';
const TOKEN = 'ms-7ff597b4-7295-45be-9fd9-dff885838694';

const origFetch = globalThis.fetch;
globalThis.fetch = async (url, opts) => {
  const u = String(url);
  if (u.includes('gradio') || u.includes('/config') || u.includes('ms.show') || u.includes('modelscope')) {
    console.log('\nFETCH', opts?.method || 'GET', u);
    if (opts?.headers) console.log('HDR', JSON.stringify(opts.headers));
    if (opts?.body) console.log('BODY', String(opts.body).slice(0, 500));
  }
  const res = await origFetch(url, opts);
  if (u.includes('gradio') || u.includes('/config') || u.includes('ms.show') || u.includes('modelscope')) {
    const clone = res.clone();
    const text = await clone.text();
    console.log('RESP', res.status, text.slice(0, 500));
  }
  return res;
};

const client = await Client.connect(BASE, { hf_token: TOKEN });
const result = await client.predict('/respond', { message: '你好' });
console.log('\nRESULT', result.data?.[0]?.slice?.(0, 120));
