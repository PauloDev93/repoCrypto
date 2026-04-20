// API helpers — markets/global vão via edge function (cache 30s p/ evitar rate limit).

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const FN_BASE = `https://${PROJECT_ID}.functions.supabase.co/market-data`;

const fnHeaders = {
  Authorization: `Bearer ${ANON_KEY}`,
  apikey: ANON_KEY,
};

export type CoinTicker = {
  id: string;
  symbol: string;
  name: string;
  current_price: number | null;
  price_change_percentage_24h: number | null;
  market_cap: number | null;
  total_volume: number | null;
  ath: number | null;
  ath_change_percentage: number | null;
  image: string;
};

export async function fetchTopCoins(): Promise<CoinTicker[]> {
  const res = await fetch(`${FN_BASE}?endpoint=markets`, { headers: fnHeaders });
  if (!res.ok) throw new Error("market-data markets falhou");
  return res.json();
}

export type GlobalData = {
  total_market_cap_usd: number;
  total_volume_usd: number;
  market_cap_change_percentage_24h_usd: number;
  btc_dominance: number;
  eth_dominance: number;
  active_cryptocurrencies: number;
};

export async function fetchGlobal(): Promise<GlobalData> {
  const res = await fetch(`${FN_BASE}?endpoint=global`, { headers: fnHeaders });
  if (!res.ok) throw new Error("market-data global falhou");
  const j = await res.json();
  const d = j.data;
  return {
    total_market_cap_usd: d.total_market_cap.usd,
    total_volume_usd: d.total_volume.usd,
    market_cap_change_percentage_24h_usd: d.market_cap_change_percentage_24h_usd,
    btc_dominance: d.market_cap_percentage.btc,
    eth_dominance: d.market_cap_percentage.eth,
    active_cryptocurrencies: d.active_cryptocurrencies,
  };
}

export type FearGreed = {
  value: number;
  classification: string;
  timestamp: string;
};

export async function fetchFearGreed(): Promise<FearGreed> {
  const res = await fetch("https://api.alternative.me/fng/?limit=1");
  if (!res.ok) throw new Error("Fear & Greed falhou");
  const j = await res.json();
  const d = j.data[0];
  return {
    value: Number(d.value),
    classification: d.value_classification,
    timestamp: d.timestamp,
  };
}

export function formatUSD(n: number | null | undefined, opts: { compact?: boolean } = {}) {
  if (n == null || !Number.isFinite(n)) return "—";
  if (opts.compact) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(n);
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n < 1 ? 6 : 2,
  }).format(n);
}

export function formatPct(n: number | null | undefined) {
  if (n == null || !Number.isFinite(n)) return "—";
  const s = n >= 0 ? "+" : "";
  return `${s}${n.toFixed(2)}%`;
}
