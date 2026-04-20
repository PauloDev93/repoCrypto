import { useEffect, useState } from "react";
import { fetchFearGreed, fetchGlobal, fetchTopCoins, type CoinTicker, type FearGreed, type GlobalData } from "@/lib/marketApi";

export function useMarket(refreshMs = 30_000) {
  const [coins, setCoins] = useState<CoinTicker[] | null>(null);
  const [global, setGlobal] = useState<GlobalData | null>(null);
  const [fng, setFng] = useState<FearGreed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [c, g, f] = await Promise.allSettled([fetchTopCoins(), fetchGlobal(), fetchFearGreed()]);
        if (!active) return;
        if (c.status === "fulfilled") setCoins(c.value);
        if (g.status === "fulfilled") setGlobal(g.value);
        if (f.status === "fulfilled") setFng(f.value);
        if (c.status === "rejected" && g.status === "rejected") {
          setError("Falha ao carregar dados de mercado");
        } else {
          setError(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, refreshMs);
    return () => { active = false; clearInterval(id); };
  }, [refreshMs]);

  return { coins, global, fng, loading, error };
}
