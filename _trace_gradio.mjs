import { Client } from '@gradio/client';

const BASE = 'https://studio-zsz1314520-bainmoon-chat.api-inference.modelscope.net/';
const TOKEN = 'ms-7ff597b4-7295-45be-9fd9-dff885838694';

const client = await Client.connect(BASE, { hf_token: TOKEN });
const config = client.config;
console.log('root', config?.root);
console.log('api_prefix', client.api_prefix);
console.log('respond dep', config?.dependencies?.find((d) => d.api_name === 'respond'));

const origFetch = globalThis.fetch;
globalThis.fetch = async (url, opts) => {
  const u = String(url);
  if (u.includes('gradio_api') || u.includes('/config') || u.includes('/info')) {
    console.log('\nFETCH', opts?.method || 'GET', u);
    if (opts?.body) console.log('BODY', String(opts.body).slice(0, 300));
  }
  const res = await origFetch(url, opts);
  if (u.includes('gradio_api') || u.includes('/config') || u.includes('/info')) {
    const clone = res.clone();
    const text = await clone.text();
    console.log('RESP', res.status, text.slice(0, 400));
  }
  return res;
};

const result = await client.predict('/respond', { message: '你好' });
console.log('\nRESULT', JSON.stringify(result));
