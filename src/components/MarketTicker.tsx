import { useMarket } from "@/hooks/useMarket";
import { formatPct, formatUSD } from "@/lib/marketApi";

export function MarketTicker() {
  const { coins } = useMarket();
  if (!coins?.length) return null;
  const list = [...coins, ...coins];
  return (
    <div className="relative overflow-hidden border-y border-border bg-card/60 backdrop-blur">
      <div className="animate-ticker flex gap-8 whitespace-nowrap py-2">
        {list.map((c, i) => {
          const pct = c.price_change_percentage_24h;
          const up = (pct ?? 0) >= 0;
          return (
            <div key={`${c.id}-${i}`} className="flex items-center gap-2 text-xs font-mono-num">
              <span className="font-semibold uppercase">{c.symbol}</span>
              <span className="text-foreground">{formatUSD(c.current_price)}</span>
              <span className={up ? "text-primary" : "text-destructive"}>
                {formatPct(pct)}
              </span>
              <span className="text-muted-foreground">·</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
