import { Bell, Search } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MetricsHeader } from "@/components/MetricsHeader";
import { TradingViewChart } from "@/components/TradingViewChart";
import { WhaleMonitor } from "@/components/WhaleMonitor";
import { MarketTicker } from "@/components/MarketTicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-3 backdrop-blur md:px-5">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="hidden md:flex items-center gap-2">
              <span className="font-display text-sm font-semibold tracking-tight">Visão Geral</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono-num">
                · Live
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-neon" />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar ativo (BTC, ETH…)"
                  className="h-9 w-[220px] pl-8 bg-secondary/50 border-border font-mono-num text-xs"
                />
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <MarketTicker />

          {/* Main */}
          <main className="flex-1 space-y-4 px-3 py-4 md:px-5 md:py-5">
            <MetricsHeader />

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TradingViewChart symbol="BINANCE:BTCUSDT" />
              </div>
              <div className="lg:col-span-1">
                <WhaleMonitor />
              </div>
            </div>

            <footer className="pt-4 text-center text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono-num">
              Crypto Sentinel · Dados via CoinGecko, Alternative.me &amp; TradingView
            </footer>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
