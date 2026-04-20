// Edge function que faz proxy + cache (30s) das chamadas CoinGecko
// para evitar rate limit no cliente.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const CG = "https://api.coingecko.com/api/v3";
const TTL_MS = 30_000;

type CacheEntry = { data: unknown; expiresAt: number };
const cache = new Map<string, CacheEntry>();

async function fetchWithCache(key: string, url: string) {
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expiresAt > now) {
    return { data: hit.data, cached: true };
  }
  const res = await fetch(url, {
    headers: { "accept": "application/json", "user-agent": "crypto-sentinel/1.0" },
  });
  if (!res.ok) {
    // Se falhar mas tivermos cache antigo, devolve o stale para evitar tela vazia
    if (hit) return { data: hit.data, cached: true, stale: true };
    throw new Error(`CoinGecko ${res.status}`);
  }
  const data = await res.json();
  cache.set(key, { data, expiresAt: now + TTL_MS });
  return { data, cached: false };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.searchParams.get("endpoint") ?? "markets";

    let target: string;
    let key: string;

    if (endpoint === "markets") {
      key = "markets:top10";
      target = `${CG}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;
    } else if (endpoint === "global") {
      key = "global";
      target = `${CG}/global`;
    } else {
      return new Response(JSON.stringify({ error: "endpoint inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data, cached, stale } = await fetchWithCache(key, target);
    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "x-cache": cached ? (stale ? "STALE" : "HIT") : "MISS",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "erro desconhecido";
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
