import { performance } from 'node:perf_hooks';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000/api';
const EMAIL = process.env.FLOWMIND_EMAIL || '';
const PASSWORD = process.env.FLOWMIND_PASSWORD || '';
const NAME = process.env.FLOWMIND_NAME || 'Zhang San';

const CONCURRENCY = Number(process.env.CONCURRENCY || 10);
const REQUESTS = Number(process.env.REQUESTS || 200);

const percentile = (arr, p) => {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(sorted.length - 1, idx))];
};

const mean = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

const request = async (url, opts) => {
  const t0 = performance.now();
  const res = await fetch(url, opts);
  const text = await res.text().catch(() => '');
  const t1 = performance.now();
  return { ok: res.ok, status: res.status, ms: t1 - t0, text };
};

const login = async () => {
  if (!EMAIL || !PASSWORD) {
    throw new Error('Missing FLOWMIND_EMAIL or FLOWMIND_PASSWORD');
  }

  const r = await request(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });

  if (!r.ok) {
    throw new Error(`Login failed: ${r.status} ${r.text}`);
  }

  const data = JSON.parse(r.text);
  const token = data?.data?.token;
  if (!token) {
    throw new Error('Login response missing token');
  }
  return token;
};

const register = async () => {
  if (!EMAIL || !PASSWORD) {
    throw new Error('Missing FLOWMIND_EMAIL or FLOWMIND_PASSWORD');
  }

  const r = await request(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: NAME, email: EMAIL, password: PASSWORD }),
  });

  if (!r.ok) {
    throw new Error(`Register failed: ${r.status} ${r.text}`);
  }
};

const ensureToken = async () => {
  try {
    return await login();
  } catch (_e) {
    await register();
    return await login();
  }
};

const runLoad = async ({ name, url, method = 'GET', headers = {}, body }) => {
  const durations = [];
  const failures = [];

  let cursor = 0;
  const worker = async () => {
    while (true) {
      const i = cursor++;
      if (i >= REQUESTS) return;

      try {
        const r = await request(url, {
          method,
          headers,
          body,
        });
        durations.push(r.ms);
        if (!r.ok) {
          failures.push({ status: r.status, text: r.text.slice(0, 200) });
        }
      } catch (e) {
        durations.push(30_000);
        failures.push({ status: 'ERR', text: String(e).slice(0, 200) });
      }
    }
  };

  const startedAt = performance.now();
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  const totalMs = performance.now() - startedAt;

  const p50 = percentile(durations, 50);
  const p90 = percentile(durations, 90);
  const p95 = percentile(durations, 95);
  const p99 = percentile(durations, 99);

  const result = {
    name,
    requests: durations.length,
    concurrency: CONCURRENCY,
    totalMs,
    rps: durations.length ? (durations.length / (totalMs / 1000)) : 0,
    avgMs: mean(durations),
    p50,
    p90,
    p95,
    p99,
    failures: failures.length,
  };

  return { result, failures: failures.slice(0, 5) };
};

const main = async () => {
  const token = await ensureToken();
  const authHeader = { Authorization: `Bearer ${token}` };

  const targets = [
    { name: 'GET /projects?limit=10', url: `${BASE_URL}/projects?page=1&limit=10`, method: 'GET' },
    { name: 'GET /documents', url: `${BASE_URL}/documents`, method: 'GET' },
    { name: 'GET /dashboard/stats', url: `${BASE_URL}/dashboard/stats`, method: 'GET' },
    { name: 'GET /auth/me', url: `${BASE_URL}/auth/me`, method: 'GET' },
  ];

  const results = [];

  for (const t of targets) {
    const { result, failures } = await runLoad({
      name: t.name,
      url: t.url,
      method: t.method,
      headers: {
        ...authHeader,
      },
    });

    results.push({ ...result, sampleFailures: failures });
  }

  console.log(JSON.stringify({ baseUrl: BASE_URL, requests: REQUESTS, concurrency: CONCURRENCY, results }, null, 2));

  const allP95 = results.map((r) => r.p95);
  const maxP95 = allP95.length ? Math.max(...allP95) : 0;
  if (maxP95 > 500) {
    process.exitCode = 2;
  }
};

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
