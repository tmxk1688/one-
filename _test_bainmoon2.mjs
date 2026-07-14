const base = 'https://studio-zsz1314520-bainmoon-chat.api-inference.modelscope.net';
const token = 'ms-7ff597b4-7295-45be-9fd9-dff885838694';
const hdr = {
  'Content-Type': 'application/json',
  Accept: 'application/json, text/event-stream',
  Authorization: `Bearer ${token}`,
};

async function mcpCall(message) {
  const r = await fetch(`${base}/gradio_api/mcp/`, {
    method: 'POST',
    headers: hdr,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: { name: 'respond', arguments: { message } },
    }),
  });
  return r.text();
}

for (const msg of ['Hello!!', 'hi', '你好', '测试']) {
  const t = await mcpCall(msg);
  const match = t.match(/"text":"([^"]*)"/);
  console.log(msg, '=>', match ? match[1] : t.slice(0, 120));
}
