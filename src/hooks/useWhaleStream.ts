import { useEffect, useRef, useState } from "react";

export type WhaleTx = {
  id: string;
  ts: number;
  symbol: "BTC" | "ETH" | "USDT" | "SOL";
  amountUsd: number;
  fromType: "wallet" | "exchange";
  toType: "wallet" | "exchange";
  fromLabel: string;
  toLabel: string;
  hash: string;
};

const EXCHANGES = ["Binance", "Coinbase", "Kraken", "OKX", "Bitfinex", "Bybit"];
const WALLETS = ["Whale 0x4f…a91", "Whale bc1q…7e2", "Whale 0xab…c12", "Whale 3FZb…9k", "Whale 0xde…f04"];
const SYMBOLS: WhaleTx["symbol"][] = ["BTC", "ETH", "USDT", "SOL"];

function rand<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

function makeTx(): WhaleTx {
  const symbol = rand(SYMBOLS);
  const amountUsd = Math.round((1 + Math.random() * 49) * 1_000_000);
  const fromExch = Math.random() < 0.5;
  const toExch = !fromExch ? Math.random() < 0.7 : Math.random() < 0.3;
  return {
    id: crypto.randomUUID(),
    ts: Date.now(),
    symbol,
    amountUsd,
    fromType: fromExch ? "exchange" : "wallet",
    toType: toExch ? "exchange" : "wallet",
    fromLabel: fromExch ? rand(EXCHANGES) : rand(WALLETS),
    toLabel: toExch ? rand(EXCHANGES) : rand(WALLETS),
    hash: "0x" + Math.random().toString(16).slice(2, 10) + "…" + Math.random().toString(16).slice(2, 6),
  };
}

export function useWhaleStream(maxItems = 25) {
  const [txs, setTxs] = useState<WhaleTx[]>(() => Array.from({ length: 8 }, makeTx));
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      setTxs((prev) => [makeTx(), ...prev].slice(0, maxItems));
      timer.current = window.setTimeout(tick, 3500 + Math.random() * 4500);
    };
    timer.current = window.setTimeout(tick, 2500);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [maxItems]);

  return txs;
}
