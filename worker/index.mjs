// Cloudflare Worker: serves the static site and a small API that returns the latest
// Facebook Page posts. The Page access token is stored as the secret FB_PAGE_TOKEN
// (Cloudflare dashboard → Settings → Variables and Secrets) and never reaches the browser.
const GRAPH = 'https://graph.facebook.com/v24.0';
const CACHE_SECONDS = 900; // refresh from Facebook at most every 15 minutes

const json = (data, status = 200, maxAge = 0) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': maxAge ? `public, max-age=${maxAge}` : 'no-store',
    },
  });

async function fbPosts(request, env, ctx) {
  if (!env.FB_PAGE_TOKEN) return json({ error: 'not_configured' }, 503);

  const cache = caches.default;
  const key = new Request(new URL('/api/fb-posts', request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;

  const api = new URL(`${GRAPH}/me/posts`);
  api.searchParams.set('fields', 'message,created_time,permalink_url,full_picture');
  api.searchParams.set('limit', '9');
  api.searchParams.set('access_token', env.FB_PAGE_TOKEN);

  let data;
  try {
    const r = await fetch(api, { cf: { cacheTtl: 0 } });
    data = await r.json();
    if (!r.ok || data.error) {
      console.log('Facebook API error', JSON.stringify(data.error || r.status));
      return json({ error: 'facebook_error', detail: data.error?.message || String(r.status) }, 502);
    }
  } catch (e) {
    console.log('Facebook fetch failed', e.message);
    return json({ error: 'facebook_unreachable' }, 502);
  }

  const posts = (data.data || [])
    .filter((p) => p.message || p.full_picture)
    .slice(0, 6)
    .map((p) => ({
      id: p.id,
      message: p.message || '',
      created: p.created_time,
      url: p.permalink_url,
      image: p.full_picture || null,
    }));

  const res = json({ posts, updated: new Date().toISOString() }, 200, CACHE_SECONDS);
  ctx.waitUntil(cache.put(key, res.clone()));
  return res;
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/fb-posts') return fbPosts(request, env, ctx);
    return env.ASSETS.fetch(request);
  },
};
