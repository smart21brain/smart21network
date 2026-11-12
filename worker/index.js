/* Smart21Network AI Worker (Cloudflare Workers AI)
   Serves the website (./www) and answers  POST /api/ai-assistant  { prompt, history:[{role,content}], context:{...}, stream:true|false }
     stream:true  -> Server-Sent Events:  data: {"t":"text piece"} ... data: [DONE]
     stream:false -> JSON:                { "answer": "full text" }
   GET  /  -> { ok:true, ai:true }   (open the Worker address in a browser to check it)
   Needs the Workers AI binding named  AI  (Dashboard -> Worker -> Settings -> Bindings -> Add -> Workers AI).
   Optional variables: AI_MODEL (your preferred model; leave empty for the built-in list), ALLOWED_ORIGINS ("https://a.com,https://localhost" - empty = any). */

/* Models are tried in this order until one answers. Cloudflare retired @cf/meta/llama-3.1-8b-instruct on 2026-05-30 (error 5028). */
const MODELS = ['@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/zai-org/glm-4.7-flash', '@cf/google/gemma-4-26b-a4b-it'];
const RETIRED = new Set(['@cf/meta/llama-3.1-8b-instruct', '@cf/meta/llama-3.1-8b-instruct-awq', '@cf/meta/llama-3.1-8b-instruct-fast', '@cf/meta/llama-3.1-8b-instruct-fp8', '@cf/meta/llama-3.1-70b-instruct',
  '@cf/meta/llama-3-8b-instruct', '@cf/meta/llama-3-8b-instruct-awq', '@hf/meta-llama/meta-llama-3-8b-instruct', '@cf/meta/llama-3.2-1b-instruct', '@cf/meta/llama-3.2-3b-instruct', '@cf/google/gemma-3-12b-it']);
function modelList(env) {
  const pick = String((env && env.AI_MODEL) || '').trim();
  const first = pick && /^@(cf|hf)\/[\w.\-\/]+$/.test(pick) && !RETIRED.has(pick) ? [pick] : [];   // your own choice first (retired ones are ignored)
  return [...new Set([...first, ...MODELS])];
}
const MAX_TOKENS = 1024;

const SYSTEM = [
  'You are Smart21Network AI, the built-in tutor of the Smart21Network simulator by Smart21Brain.',
  'You help with computer networks: routers, switches, VLANs, trunks, STP, routing (static, RIP, OSPF, BGP), NAT, DHCP, DNS, ACLs, firewalls, Wi-Fi, subnetting, IPv4/IPv6, Cisco IOS and MikroTik RouterOS commands, and troubleshooting.',
  'Answer in the language the user writes in (English or Kiswahili). Be clear and practical: short steps, exact commands in code blocks, and say what each command does.',
  'If a network topology is supplied as context, use it to give specific advice about that network. Never invent devices that are not in it.'
].join(' ');

function corsFor(request, env) {
  const origin = request.headers.get('Origin') || '';
  const list = String((env && env.ALLOWED_ORIGINS) || '').split(',').map(s => s.trim()).filter(Boolean);
  const allow = !list.length ? '*' : (list.includes(origin) ? origin : list[0]);
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}
const json = (obj, status, cors) => new Response(JSON.stringify(obj), { status: status || 200, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

/* Workers AI streams  data: {"response":"..."}  ->  we send  data: {"t":"..."}  (what the app reads) */
function toApp(stream) {
  const dec = new TextDecoder(), enc = new TextEncoder();
  let buf = '';
  function emit(block, ctl) {
    block.split('\n').forEach(line => {
      if (line.indexOf('data:') !== 0) return;
      const d = line.slice(5).trim();
      if (!d || d === '[DONE]') return;
      try {
        const j = JSON.parse(d);
        const t = typeof j.response === 'string' ? j.response : ((j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content) || '');
        if (t) ctl.enqueue(enc.encode('data: ' + JSON.stringify({ t }) + '\n\n'));
      } catch (e) { /* ignore a broken piece */ }
    });
  }
  return stream.pipeThrough(new TransformStream({
    transform(chunk, ctl) {
      buf += dec.decode(chunk, { stream: true });
      let i;
      while ((i = buf.indexOf('\n\n')) >= 0) { const block = buf.slice(0, i); buf = buf.slice(i + 2); emit(block, ctl); }
    },
    flush(ctl) { if (buf.trim()) emit(buf, ctl); ctl.enqueue(enc.encode('data: [DONE]\n\n')); }
  }));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url), api = url.pathname.startsWith('/api/');
    if (!api && env && env.ASSETS) return env.ASSETS.fetch(request);          // the website itself (files in ./www)
    const cors = corsFor(request, env);
    if (api && env && env.ASSETS && url.pathname !== '/api/ai-assistant' && url.pathname !== '/api/ai') return json({ error: 'Not found.' }, 404, cors);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method === 'GET') return json({ ok: true, ai: !!(env && env.AI), service: 'smart21network-ai', models: modelList(env) }, 200, cors);
    if (request.method !== 'POST') return json({ error: 'Use POST.' }, 405, cors);
    if (!env || !env.AI) return json({ error: 'Workers AI binding "AI" is missing. In the Cloudflare dashboard open your Worker, then Settings, Bindings, Add, Workers AI, and name it AI.' }, 500, cors);

    let body;
    try { body = await request.json(); } catch (e) { return json({ error: 'Send JSON: { "prompt": "..." }' }, 400, cors); }
    const prompt = String((body && body.prompt) || '').trim().slice(0, 6000);
    if (!prompt) return json({ error: 'The question is empty.' }, 400, cors);

    const history = (Array.isArray(body.history) ? body.history : []).slice(-12)
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));
    let system = SYSTEM;
    if (body.context && typeof body.context === 'object') {
      let c = ''; try { c = JSON.stringify(body.context); } catch (e) { c = ''; }
      if (c && c !== '{}') system += '\n\nCurrent network in the simulator (JSON, may be shortened):\n' + c.slice(0, 7000);
    }
    const messages = [{ role: 'system', content: system }, ...history, { role: 'user', content: prompt }];
    const wantStream = body.stream !== false;
    let lastErr = null;
    for (const model of modelList(env)) {
      try {
        if (wantStream) {
          const s = await env.AI.run(model, { messages, stream: true, max_tokens: MAX_TOKENS, temperature: 0.3 });
          return new Response(toApp(s), { headers: { ...cors, 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no', 'X-AI-Model': model } });
        }
        const r = await env.AI.run(model, { messages, max_tokens: MAX_TOKENS, temperature: 0.3 });
        const answer = (r && (r.response || (r.result && r.result.response) || (r.choices && r.choices[0] && r.choices[0].message && r.choices[0].message.content))) || '';
        if (answer) return json({ answer: String(answer) }, 200, { ...cors, 'X-AI-Model': model });
        lastErr = new Error('empty answer from ' + model);
      } catch (e) { lastErr = e; }          // model retired / unavailable / out of allowance: try the next one
    }
    return json({ error: 'Workers AI error: ' + (lastErr && lastErr.message ? lastErr.message : 'no model answered') }, 502, cors);
  }
};
