export async function onRequestGet(context) {
  const { env } = context;
  if (!env.RAPIDAPI_KEY || !env.TOURN_ID) {
    return new Response(JSON.stringify({
      error: "Missing RAPIDAPI_KEY or TOURN_ID environment variable."
    }), { status: 503, headers: { "content-type": "application/json" }});
  }

  const year = env.YEAR || "2026";
  const orgId = env.ORG_ID || "1";
  const host = "live-golf-data.p.rapidapi.com";
  const url = new URL(`https://${host}/leaderboard`);
  url.searchParams.set("orgId", orgId);
  url.searchParams.set("tournId", env.TOURN_ID);
  url.searchParams.set("year", year);

  const upstream = await fetch(url.toString(), {
    headers: {
      "x-rapidapi-key": env.RAPIDAPI_KEY,
      "x-rapidapi-host": host
    },
    cf: { cacheTtl: 840, cacheEverything: true }
  });

  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "application/json",
      "cache-control": "public, max-age=840"
    }
  });
}