export async function onRequest(context) {
  const { request, env } = context;
  const headers = { 'content-type': 'application/json', 'cache-control': 'no-store' };
  if (!env.SWEEPSTAKE_DATA) return new Response(JSON.stringify({error:'Missing SWEEPSTAKE_DATA KV binding'}),{status:503,headers});
  if (request.method === 'GET') {
    const saved = await env.SWEEPSTAKE_DATA.get('competition','json');
    return new Response(JSON.stringify(saved || {entries:[],updatedAt:null}),{headers});
  }
  if (request.method === 'POST') {
    const supplied=request.headers.get('x-admin-password')||'';
    if (!env.ADMIN_PASSWORD || supplied !== env.ADMIN_PASSWORD) return new Response(JSON.stringify({error:'Incorrect organiser password'}),{status:401,headers});
    const url=new URL(request.url);
    if(url.searchParams.get('verify')==='1') return new Response(JSON.stringify({ok:true}),{headers});
    const body=await request.json().catch(()=>null);
    if (!body || !Array.isArray(body.entries) || !body.entries.length) return new Response(JSON.stringify({error:'No valid entries supplied'}),{status:400,headers});
    const clean=body.entries.map(e=>({entrant:String(e.entrant||'').trim(),players:(e.players||[]).slice(0,3).map(x=>String(x||'').trim())})).filter(e=>e.entrant&&e.players.length===3&&e.players.every(Boolean));
    if (!clean.length) return new Response(JSON.stringify({error:'No valid entries remained after validation'}),{status:400,headers});
    const updatedAt=new Date().toISOString();
    await env.SWEEPSTAKE_DATA.put('competition',JSON.stringify({entries:clean,updatedAt}));
    return new Response(JSON.stringify({ok:true,count:clean.length,updatedAt}),{headers});
  }
  return new Response(JSON.stringify({error:'Method not allowed'}),{status:405,headers});
}