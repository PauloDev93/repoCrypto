import { useEffect, useRef } from "react";

declare global {
  interface Window { TradingView?: any }
}

export function TradingViewChart({ symbol = "BINANCE:BTCUSDT" }: { symbol?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const containerId = useRef(`tv_${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    const id = containerId.current;
    const mount = () => {
      if (!window.TradingView || !ref.current) return;
      ref.current.innerHTML = `<div id="${id}" style="height:100%;width:100%"></div>`;
      new window.TradingView.widget({
        autosize: true,
        symbol,
        interval: "60",
        timezone: "America/Sao_Paulo",
        theme: "dark",
        style: "1",
        locale: "br",
        toolbar_bg: "#0a1820",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        container_id: id,
        studies: [
          "MACD@tv-basicstudies",
          "RSI@tv-basicstudies",
          "MAExp@tv-basicstudies",
        ],
        overrides: {
          "paneProperties.background": "#071218",
          "paneProperties.backgroundType": "solid",
          "paneProperties.vertGridProperties.color": "rgba(45,212,168,0.05)",
          "paneProperties.horzGridProperties.color": "rgba(45,212,168,0.05)",
          "scalesProperties.textColor": "#7a9aa3",
        },
      });
    };

    if (window.TradingView) {
      mount();
    } else {
      const existing = document.querySelector<HTMLScriptElement>('script[data-tv="1"]');
      if (existing) {
        existing.addEventListener("load", mount, { once: true });
      } else {
        const s = document.createElement("script");
        s.src = "https://s3.tradingview.com/tv.js";
        s.async = true;
        s.dataset.tv = "1";
        s.onload = mount;
        document.head.appendChild(s);
      }
    }
  }, [symbol]);

  return (
    <div className="surface-card relative overflow-hidden rounded-xl border border-border animate-fade-in">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary pulse-neon" />
          <span className="font-display text-sm font-semibold tracking-tight">Gráfico Avançado · TradingView</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono-num">
          MACD · RSI · EMA
        </span>
      </div>
      <div ref={ref} className="h-[520px] w-full bg-[#071218]" />
    </div>
  );
}
