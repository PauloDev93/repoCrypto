## 🐋 Crypto Sentinel Dashboard

Inteligência de Mercado, Fluxo On-Chain e Análise de Sentimento em Tempo Real.

O Crypto Sentinel é uma central de comando para investidores que desejam fugir do ruído do varejo. O projeto foca no cruzamento de dados técnicos tradicionais com métricas de "Smart Money" (Baleias e Mineradores) para identificar armadilhas e oportunidades de mercado.
------------------------------
## 🏗️ Arquitetura de Software
O projeto segue uma arquitetura moderna de Single Page Application (SPA), priorizando performance e desacoplamento:
---> Bem vindos ao nosso Crypto Sentinel

* Camada de Frontend: Construída em React 18 com Vite, garantindo um bundle leve e carregamento quase instantâneo.
* Gerenciamento de Estado: Utiliza hooks nativos e TanStack Query (React Query) para lidar com o estado assíncrono das APIs e o sistema de cache.
* Middleware (Edge Computing): Implementação de Supabase Edge Functions (escritas em Deno/TypeScript) que atuam como um Proxy entre o cliente e as APIs externas, resolvendo problemas de CORS e Rate Limiting.
* Persistência: Supabase (PostgreSQL) para armazenamento de perfis de usuário, alertas personalizados e histórico de preferências.

## 💻 Stack Tecnológica## Linguagens e Core

* TypeScript: Tipagem estrita para reduzir erros em tempo de execução e facilitar a manutenção.
* Node.js/Deno: Ambientes de execução para ferramentas de build e funções de backend.

## Estilização e UI/UX

* Tailwind CSS: Framework utilitário para estilização rápida e responsiva.
* Shadcn/UI: Biblioteca de componentes acessíveis e altamente customizáveis (Radix UI + Lucide Icons).
* Framer Motion: Para animações fluidas nos cards de alerta e transições de estado.

## Integrações (Data Sources)

* TradingView Advanced Charts: Renderização de candles e indicadores técnicos (RSI, MACD, EMA).
* CoinLore API: Fonte para dados históricos, dominância global e estatísticas de mercado.
* Whale Alert (Logic): Algoritmo de filtragem para transações de alta monta (> $1M).
* Alternative.me API: Captura do Fear & Greed Index (Sentimento do Mercado).

------------------------------
## 🧠 Lógica de Negócio e Inteligência
O grande diferencial do código está no motor de Análise de Divergência:

   1. Filtro de Ruído: O sistema processa transações On-Chain e filtra apenas o movimento de baleias, classificando-as como Inflow (Potencial Venda) ou Outflow (Acúmulo).
   2. Correlação Preço vs. Sentimento: O dashboard cruza a variação percentual do preço com o índice de medo/ganância.
   * Racional: Se o preço sobe mas o índice de medo também aumenta, o sistema dispara um alerta de Bull Trap.
   3. Estratégia de Cache: Para mitigar o limite de requisições das APIs gratuitas, as Edge Functions utilizam uma lógica de Stale-While-Revalidate, servindo dados do cache enquanto atualizam o fundo de forma silenciosa.

------------------------------
## 🛠️ Como Instalar e Configurar

   1. Clonar e Instalar:
   
   git clone https://github.com
   cd crypto-sentinel
   npm install
   
   2. Variáveis de Ambiente:
   Crie um arquivo .env na raiz:
   
   VITE_SUPABASE_URL=seu_url_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anon
   
   3. Execução:
   
   npm run dev
   
   
------------------------------
## 📈 Roadmap de Evolução

* Integração com WebSockets para preços "Tick-by-Tick".
* Implementação de notificações via Telegram para alertas de baleias.
* Módulo de Backtesting para estratégias de cruzamento de médias.

------------------------------
Disclaimer: Este projeto é para fins educacionais e de monitoramento de dados. Sempre faça sua própria gestão de risco.