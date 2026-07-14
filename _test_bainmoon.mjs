import { Client } from '@gradio/client';

const TOKEN = 'ms-7ff597b4-7295-45be-9fd9-dff885838694';
const BASE = 'https://studio-zsz1314520-bainmoon-chat.api-inference.modelscope.net/';

async function main() {
  const client = await Client.connect(BASE, {
    hf_token: TOKEN,
  });
  console.log('connected');
  const result = await client.predict('/respond', { message: '你好，请用一句话介绍你自己' });
  console.log('result:', JSON.stringify(result, null, 2));
}

main().catch((e) => {
  console.error('error:', e);
  process.exit(1);
});
