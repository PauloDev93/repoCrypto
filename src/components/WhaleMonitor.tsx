import { ArrowRight, ShieldAlert, ShieldCheck, Waves } from "lucide-react";
import { useWhaleStream, type WhaleTx } from "@/hooks/useWhaleStream";
import { formatUSD } from "@/lib/marketApi";
import { cn } from "@/lib/utils";

function classify(tx: WhaleTx): { label: string; tone: "sell" | "buy" | "neutral"; icon: React.ReactNode } {
  if (tx.fromType === "wallet" && tx.toType === "exchange") {
    return { label: "Pressão de Venda", tone: "sell", icon: <ShieldAlert className="h-3.5 w-3.5" /> };
  }
  if (tx.fromType === "exchange" && tx.toType === "wallet") {
    return { label: "Acúmulo", tone: "buy", icon: <ShieldCheck className="h-3.5 w-3.5" /> };
  }
  return { label: "Transferência", tone: "neutral", icon: <Waves className="h-3.5 w-3.5" /> };
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}min`;
  return `${Math.floor(m / 60)}h`;
}

export function WhaleMonitor() {
  const txs = useWhaleStream(20);

  return (
    <div className="surface-card relative overflow-hidden rounded-xl border border-border animate-fade-in">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent pulse-neon" />
          <span className="font-display text-sm font-semibold tracking-tight">Terminal de Baleias</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono-num">
          Transações &gt; $1M
        </span>
      </div>

      <ul className="max-h-[520px] divide-y divide-border overflow-y-auto">
        {txs.map((tx) => {
          const { label, tone, icon } = classify(tx);
          return (
            <li
              key={tx.id}
              className="group relative px-4 py-3 transition-colors hover:bg-secondary/40 animate-fade-in"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                      tone === "sell" && "border-destructive/40 bg-destructive/10 text-destructive",
                      tone === "buy" && "border-primary/40 bg-primary/10 text-primary",
                      tone === "neutral" && "border-border bg-muted/30 text-muted-foreground"
                    )}
                  >
                    {icon}
                    {label}
                  </span>
                  <span className="font-mono-num text-xs text-muted-foreground shrink-0">
                    {tx.symbol}
                  </span>
                </div>
                <div className="font-display font-semibold font-mono-num text-sm tabular-nums">
                  {formatUSD(tx.amountUsd, { compact: true })}
                </div>
              </div>

              <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="truncate font-mono-num">{tx.fromLabel}</span>
                <ArrowRight className="h-3 w-3 shrink-0 text-primary/70" />
                <span className="truncate font-mono-num">{tx.toLabel}</span>
                <span className="ml-auto shrink-0 font-mono-num text-[10px] uppercase tracking-wider">
                  {timeAgo(tx.ts)} atrás
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
