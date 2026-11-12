#!/usr/bin/env node
/*
 * Smart21network school server (no dependencies, Node 18+)
 *
 *   node server/s21-server.js            # listens on http://localhost:8787
 *   PORT=9000 DATA=/var/s21/data.json node server/s21-server.js
 *
 * Accounts (teacher / student), cloud saves, classes, assignments with deadlines,
 * results and a teacher dashboard. Data lives in one JSON file.
 * Put it behind HTTPS (nginx / Caddy / Cloudflare Tunnel) before using it on the internet.
 */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const PORT = +process.env.PORT || 8787;
const DATA = process.env.DATA || path.join(__dirname, 's21-data.json');
const MAX_BODY = 4 * 1024 * 1024, TOKEN_DAYS = 30;

let db = { users: {}, tokens: {}, classes: {}, assignments: {}, results: [], saves: {} };
try { db = Object.assign(db, JSON.parse(fs.readFileSync(DATA, 'utf8'))); } catch (e) { /* first run */ }
let dirty = false, writing = false;
function persist() { dirty = true; if (writing) return; writing = true; setTimeout(function () { writing = false; if (!dirty) return; dirty = false; const tmp = DATA + '.tmp'; fs.writeFile(tmp, JSON.stringify(db), function (err) { if (!err) fs.rename(tmp, DATA, function () {}); }); }, 150); }

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 'Access-Control-Max-Age': '600' };
function send(res, code, obj) { const b = JSON.stringify(obj); res.writeHead(code, Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(b) }, CORS)); res.end(b); }
const fail = (res, code, msg) => send(res, code, { error: msg });
function body(req) { return new Promise((ok, no) => { let n = 0; const ch = []; req.on('data', c => { n += c.length; if (n > MAX_BODY) { no(new Error('Request too large')); req.destroy(); } else ch.push(c); }); req.on('end', () => { try { ok(ch.length ? JSON.parse(Buffer.concat(ch).toString('utf8')) : {}); } catch (e) { no(new Error('Bad JSON')); } }); }); }
const str = (v, n) => String(v == null ? '' : v).slice(0, n);
const num = (v, max) => Math.max(0, Math.min(max || 1e9, Math.round(+v || 0)));
const uid = () => crypto.randomBytes(6).toString('hex');
function hash(pw, salt) { return crypto.scryptSync(pw, salt, 32).toString('hex'); }
function newToken(name) { const t = crypto.randomBytes(24).toString('hex'); db.tokens[t] = { name, exp: Date.now() + TOKEN_DAYS * 864e5 }; return t; }
function auth(req) { const m = /^Bearer (\S+)/.exec(req.headers.authorization || ''); if (!m) return null; const t = db.tokens[m[1]]; if (!t || t.exp < Date.now()) return null; const u = db.users[t.name]; return u || null; }
function classCode() { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; for (;;) { let c = ''; for (let i = 0; i < 6; i++) c += A[crypto.randomInt(A.length)]; if (!db.classes[c]) return c; } }
const hits = new Map();
function limited(req) { const ip = req.socket.remoteAddress || '?', now = Date.now(), h = (hits.get(ip) || []).filter(t => now - t < 60000); h.push(now); hits.set(ip, h); return h.length > 400; }
const pub = u => ({ name: u.name, role: u.role });
const inClass = (u, c) => c && (c.teacher === u.name || c.students.includes(u.name));

async function route(req, res) {
  const url = new URL(req.url, 'http://x'), p = url.pathname.replace(/\/+$/, '') || '/', M = req.method;
  if (M === 'OPTIONS') { res.writeHead(204, CORS); return res.end(); }
  if (limited(req)) return fail(res, 429, 'Too many requests');
  if (p === '/api/health') return send(res, 200, { ok: true, name: 'Smart21network school server', users: Object.keys(db.users).length });

  if (p === '/api/register' && M === 'POST') {
    const b = await body(req), name = str(b.name, 40).trim(), pw = str(b.password, 100), role = b.role === 'teacher' ? 'teacher' : 'student', key = name.toLowerCase();
    if (name.length < 2 || !/^[\w .'-]+$/u.test(name)) return fail(res, 400, 'Choose a name of at least 2 letters or digits.');
    if (pw.length < 6) return fail(res, 400, 'The password must have at least 6 characters.');
    if (db.users[key]) return fail(res, 409, 'That name is already taken.');
    const salt = crypto.randomBytes(16).toString('hex'); db.users[key] = { name, key, role, salt, hash: hash(pw, salt), created: new Date().toISOString() }; persist();
    return send(res, 201, { token: newToken(key), user: pub(db.users[key]) });
  }
  if (p === '/api/login' && M === 'POST') {
    const b = await body(req), u = db.users[str(b.name, 40).trim().toLowerCase()];
    if (!u || !crypto.timingSafeEqual(Buffer.from(hash(str(b.password, 100), u.salt), 'hex'), Buffer.from(u.hash, 'hex'))) return fail(res, 401, 'Wrong name or password.');
    return send(res, 200, { token: newToken(u.key), user: pub(u) });
  }
  /* legacy: the app's "Send results to teacher" button posts here without a login */
  if (p === '/api/lab-results' && M === 'POST') {
    const b = await body(req), code = str(b.teacherCode, 40).trim().toUpperCase();
    if (!str(b.student, 80).trim() || !code) return fail(res, 400, 'Student name and teacher code are required');
    db.results.push(mkResult({ class: code, student: str(b.student, 80), anon: true }, b)); persist(); return send(res, 201, { ok: true });
  }
  const u = auth(req); if (!u) return fail(res, 401, 'Please sign in.');
  if (p === '/api/me') return send(res, 200, { user: pub(u) });

  /* ---- cloud saves ---- */
  const mc = /^\/api\/cloud(?:\/([^/]+))?$/.exec(p);
  if (mc) {
    const mine = db.saves[u.key] = db.saves[u.key] || {}, slot = mc[1] ? decodeURIComponent(mc[1]).slice(0, 60) : null;
    if (!slot && M === 'GET') return send(res, 200, { saves: Object.keys(mine).map(k => ({ slot: k, name: mine[k].name, updated: mine[k].updated, size: mine[k].json.length })).sort((a, b) => b.updated.localeCompare(a.updated)) });
    if (slot && M === 'GET') return mine[slot] ? send(res, 200, mine[slot]) : fail(res, 404, 'Not found');
    if (slot && M === 'PUT') { const b = await body(req), js = str(b.json, 3.5e6); if (js.length < 10) return fail(res, 400, 'Nothing to save'); if (!mine[slot] && Object.keys(mine).length >= 40) return fail(res, 400, 'You have 40 saves already. Delete some first.'); mine[slot] = { name: str(b.name || slot, 60), json: js, updated: new Date().toISOString() }; persist(); return send(res, 200, { ok: true, updated: mine[slot].updated }); }
    if (slot && M === 'DELETE') { delete mine[slot]; persist(); return send(res, 200, { ok: true }); }
  }
  /* ---- classes ---- */
  if (p === '/api/classes' && M === 'POST') {
    if (u.role !== 'teacher') return fail(res, 403, 'Only teachers can create classes.');
    const b = await body(req), name = str(b.name, 60).trim(); if (!name) return fail(res, 400, 'Give the class a name.');
    const code = classCode(); db.classes[code] = { code, name, teacher: u.name, students: [], created: new Date().toISOString() }; persist(); return send(res, 201, { class: db.classes[code] });
  }
  if (p === '/api/classes' && M === 'GET') return send(res, 200, { classes: Object.values(db.classes).filter(c => inClass(u, c)) });
  if (p === '/api/classes/join' && M === 'POST') {
    const b = await body(req), c = db.classes[str(b.code, 10).trim().toUpperCase()]; if (!c) return fail(res, 404, 'No class has that code.');
    if (u.role === 'teacher') return fail(res, 403, 'Teachers cannot join a class as students.');
    if (!c.students.includes(u.name)) { c.students.push(u.name); persist(); } return send(res, 200, { class: c });
  }
  /* ---- assignments ---- */
  if (p === '/api/assignments' && M === 'POST') {
    const b = await body(req), c = db.classes[str(b.class, 10).toUpperCase()]; if (!c || c.teacher !== u.name) return fail(res, 403, 'That is not your class.');
    const lab = str(b.lab, 3.5e6), title = str(b.title, 100).trim(); if (!title || lab.length < 10) return fail(res, 400, 'A title and a lab are required.');
    const due = b.due ? new Date(b.due) : null; if (due && isNaN(due)) return fail(res, 400, 'Bad deadline.');
    const a = { id: uid(), class: c.code, title, instructions: str(b.instructions, 2000), due: due ? due.toISOString() : null, lab, created: new Date().toISOString(), teacher: u.name };
    db.assignments[a.id] = a; persist(); return send(res, 201, { assignment: Object.assign({}, a, { lab: undefined }) });
  }
  if (p === '/api/assignments' && M === 'GET') {
    const code = str(url.searchParams.get('class'), 10).toUpperCase(), list = Object.values(db.assignments).filter(a => (!code || a.class === code) && inClass(u, db.classes[a.class]));
    return send(res, 200, { assignments: list.map(a => { const mine = db.results.filter(r => r.assignment === a.id && r.student.toLowerCase() === u.key).sort((x, y) => y.date.localeCompare(x.date))[0]; return Object.assign({}, a, { lab: undefined, mine: mine ? { score: mine.score, date: mine.date, late: mine.late } : null }); }).sort((x, y) => y.created.localeCompare(x.created)) });
  }
  const ma = /^\/api\/assignments\/([a-f0-9]+)$/.exec(p);
  if (ma && M === 'GET') { const a = db.assignments[ma[1]]; if (!a || !inClass(u, db.classes[a.class])) return fail(res, 404, 'Not found'); return send(res, 200, { assignment: a }); }
  if (ma && M === 'DELETE') { const a = db.assignments[ma[1]]; if (!a || a.teacher !== u.name) return fail(res, 403, 'Not yours'); delete db.assignments[a.id]; persist(); return send(res, 200, { ok: true }); }
  /* ---- results + dashboard ---- */
  if (p === '/api/results' && M === 'POST') {
    if (u.role !== 'student') return fail(res, 403, 'Only students submit results.');
    const b = await body(req), a = b.assignment ? db.assignments[b.assignment] : null;
    if (b.assignment && (!a || !inClass(u, db.classes[a.class]))) return fail(res, 404, 'Assignment not found');
    const cls = a ? a.class : str(b.class, 10).toUpperCase(); if (!db.classes[cls] || !db.classes[cls].students.includes(u.name)) return fail(res, 403, 'Join the class first.');
    const r = mkResult({ class: cls, student: u.name, assignment: a ? a.id : null, late: !!(a && a.due && Date.now() > Date.parse(a.due)) }, b);
    db.results.push(r); if (db.results.length > 50000) db.results.shift(); persist(); return send(res, 201, { ok: true, late: r.late });
  }
  if (p === '/api/dashboard' && M === 'GET') {
    const c = db.classes[str(url.searchParams.get('class'), 10).toUpperCase()]; if (!c || c.teacher !== u.name) return fail(res, 403, 'That is not your class.');
    const as = Object.values(db.assignments).filter(a => a.class === c.code).sort((x, y) => x.created.localeCompare(y.created)), rs = db.results.filter(r => r.class === c.code);
    const students = c.students.map(n => { const mine = rs.filter(r => r.student.toLowerCase() === n.toLowerCase()), per = {}; as.forEach(a => { const x = mine.filter(r => r.assignment === a.id).sort((p1, p2) => p2.date.localeCompare(p1.date))[0]; per[a.id] = x ? { score: x.score, late: x.late, date: x.date } : null; });
      const sc = Object.values(per).filter(Boolean).map(x => x.score); return { name: n, per, done: sc.length, avg: sc.length ? Math.round(sc.reduce((s, v) => s + v, 0) / sc.length) : null, xp: mine.reduce((m, r) => Math.max(m, r.xp || 0), 0), level: mine.reduce((m, r) => Math.max(m, r.level || 0), 0), attempts: mine.length }; });
    const all = students.filter(s => s.avg != null);
    return send(res, 200, { class: c, assignments: as.map(a => { const sc = students.map(s => s.per[a.id]).filter(Boolean); return { id: a.id, title: a.title, due: a.due, submitted: sc.length, total: c.students.length, avg: sc.length ? Math.round(sc.reduce((s, v) => s + v.score, 0) / sc.length) : null }; }), students, classAvg: all.length ? Math.round(all.reduce((s, v) => s + v.avg, 0) / all.length) : null, anonymous: rs.filter(r => r.anon).slice(-100) });
  }
  if (p === '/api/submissions' && M === 'GET') {
    const c = db.classes[str(url.searchParams.get('class'), 10).toUpperCase()], aid = url.searchParams.get('assignment'); if (!c || c.teacher !== u.name) return fail(res, 403, 'That is not your class.');
    const latest = {}; db.results.filter(r => r.class === c.code && r.submission && (!aid || r.assignment === aid)).forEach(r => { const k = r.student.toLowerCase() + '|' + r.assignment; if (!latest[k] || r.date > latest[k].date) latest[k] = r; });
    return send(res, 200, { submissions: Object.values(latest).map(r => r.submission) });
  }
  return fail(res, 404, 'Unknown endpoint');
}
function mkResult(base, b) {
  const sub = b.submission && typeof b.submission === 'object' && b.submission.kind === 'smart21network-submission' ? b.submission : null;
  if (sub && JSON.stringify(sub).length > 1.5e6) return mkResult(base, Object.assign({}, b, { submission: null }));
  return Object.assign({ id: uid(), lab: str(b.lab, 120), goalsDone: num(b.goalsDone, 1000), goalsTotal: num(b.goalsTotal, 1000), score: Math.min(100, num(b.score)), seconds: num(b.seconds, 864000), attempts: num(b.attempts, 100000), xp: num(b.xp, 1e7), level: num(b.level, 1000), date: new Date().toISOString(), submission: sub }, base);
}
http.createServer((req, res) => { route(req, res).catch(e => { if (!res.headersSent) fail(res, /large/.test(e.message) ? 413 : 400, e.message || 'Bad request'); else res.end(); }); })
  .listen(PORT, () => console.log('Smart21network school server on http://localhost:' + PORT + '  (data: ' + DATA + ')'));
