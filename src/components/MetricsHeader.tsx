import { useMemo } from "react";
import { ArrowDown, ArrowUp, Flame, Gauge, Globe2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarket } from "@/hooks/useMarket";
import { formatPct, formatUSD } from "@/lib/marketApi";
import { cn } from "@/lib/utils";

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  loading,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  accent?: "up" | "down" | "neutral";
}) {
  return (
    <div className="surface-card relative overflow-hidden rounded-xl border border-border p-4 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-glow opacity-60 pointer-events-none" />
      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <Icon className="h-3 w-3" />
            {label}
          </div>
          {loading ? (
            <Skeleton className="h-7 w-32" />
          ) : (
            <div className="font-display text-2xl font-semibold tracking-tight font-mono-num">{value}</div>
          )}
          {loading ? (
            <Skeleton className="h-3 w-20" />
          ) : (
            <div
              className={cn(
                "text-xs font-mono-num",
                accent === "up" && "text-primary",
                accent === "down" && "text-destructive",
                accent === "neutral" && "text-muted-foreground",
                !accent && "text-muted-foreground"
              )}
            >
              {sub}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FearGreedDial({ value, label, loading }: { value?: number; label?: string; loading: boolean }) {
  const v = value ?? 0;
  const color = useMemo(() => {
    if (v >= 75) return "hsl(var(--primary))";
    if (v >= 55) return "hsl(152 70% 48%)";
    if (v >= 45) return "hsl(38 95% 58%)";
    if (v >= 25) return "hsl(20 90% 58%)";
    return "hsl(var(--destructive))";
  }, [v]);
  const labelPt = (() => {
    if (!label) return "—";
    const map: Record<string, string> = {
      "Extreme Fear": "Medo Extremo",
      "Fear": "Medo",
      "Neutral": "Neutro",
      "Greed": "Ganância",
      "Extreme Greed": "Ganância Extrema",
    };
    return map[label] ?? label;
  })();

  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;

  return (
    <div className="surface-card relative overflow-hidden rounded-xl border border-border p-4 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-glow opacity-60 pointer-events-none" />
      <div className="relative flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0">
          <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
            <circle cx="36" cy="36" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
            <circle
              cx="36" cy="36" r={r} fill="none"
              stroke={color} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={c} strokeDashoffset={loading ? c : offset}
              style={{ transition: "stroke-dashoffset 800ms var(--ease-out-quart)" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-display text-xl font-semibold font-mono-num">
            {loading ? "—" : v}
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <Flame className="h-3 w-3" /> Fear &amp; Greed
          </div>
          {loading ? (
            <Skeleton className="h-5 w-28" />
          ) : (
            <div className="font-display text-base font-semibold" style={{ color }}>{labelPt}</div>
          )}
          <div className="text-xs text-muted-foreground">Sentimento do mercado</div>
        </div>
      </div>
    </div>
  );
}

export function MetricsHeader() {
  const { coins, global, fng, loading } = useMarket();
  const btc = coins?.find((c) => c.symbol === "btc");
  const eth = coins?.find((c) => c.symbol === "eth");

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <MetricCard
        label="Bitcoin · BTC"
        icon={() => <span className="text-[10px] font-mono-num text-primary">₿</span>}
        loading={loading || !btc}
        value={btc ? formatUSD(btc.current_price) : "—"}
        accent={btc && (btc.price_change_percentage_24h ?? 0) >= 0 ? "up" : "down"}
        sub={
          btc && (
            <span className="inline-flex items-center gap-1">
              {(btc.price_change_percentage_24h ?? 0) >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {formatPct(btc.price_change_percentage_24h)} · 24h
            </span>
          )
        }
      />
      <MetricCard
        label="Ethereum · ETH"
        icon={() => <span className="text-[10px] font-mono-num text-primary">Ξ</span>}
        loading={loading || !eth}
        value={eth ? formatUSD(eth.current_price) : "—"}
        accent={eth && (eth.price_change_percentage_24h ?? 0) >= 0 ? "up" : "down"}
        sub={
          eth && (
            <span className="inline-flex items-center gap-1">
              {(eth.price_change_percentage_24h ?? 0) >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {formatPct(eth.price_change_percentage_24h)} · 24h
            </span>
          )
        }
      />
      <MetricCard
        label="Dominância BTC"
        icon={Gauge}
        loading={loading || !global}
        value={global ? `${global.btc_dominance.toFixed(1)}%` : "—"}
        accent="neutral"
        sub={global ? `ETH ${global.eth_dominance.toFixed(1)}%` : undefined}
      />
      <MetricCard
        label="Volume Global 24h"
        icon={Globe2}
        loading={loading || !global}
        value={global ? formatUSD(global.total_volume_usd, { compact: true }) : "—"}
        accent={global && global.market_cap_change_percentage_24h_usd >= 0 ? "up" : "down"}
        sub={global ? `Cap ${formatPct(global.market_cap_change_percentage_24h_usd)}` : undefined}
      />
      <FearGreedDial value={fng?.value} label={fng?.classification} loading={loading || !fng} />
    </div>
  );
}
