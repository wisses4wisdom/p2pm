"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { ACTIVE_CHAIN, RPC_URL } from "../lib/chain";

const wagmiConfig = createConfig({
  chains: [ACTIVE_CHAIN],
  // Batch concurrent reads into a single multicall request, and throttle the
  // rate, so the free-tier RPC isn't hammered (was causing 429 / CORS errors).
  transports: {
    [ACTIVE_CHAIN.id]: http(RPC_URL, {
      batch: { wait: 200 },
      retryCount: 2,
      retryDelay: 1500,
    }),
  },
  batch: { multicall: true },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't retry-storm on rate limits; serve cached data while refetching.
      retry: 1,
      retryDelay: 2000,
      staleTime: 10_000,
    },
  },
});

export function Providers({ children }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        // No loginMethods override — Privy shows every login method enabled
        // in the dashboard (dashboard.privy.io -> your app -> Login methods).
        // Dark theme + brand accent/logo so the modal matches the dark login
        // page and the hand-off after "Continue with Email" feels seamless.
        appearance: {
          theme: "light",
          accentColor: "#2563eb",
          logo:
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><rect x='11' y='11' width='18' height='18' rx='3' transform='rotate(45 20 20)' fill='%232563eb'/></svg>",
          showWalletLoginFirst: false,
          loginMessage: "Sign in to your P2PM merchant terminal",
        },
        // Gas is sponsored by the Pimlico paymaster, so per-transaction
        // confirmation modals add no value — suppress them for a one-tap flow.
        embeddedWallets: {
          ethereum: { createOnLogin: "users-without-wallets" },
          showWalletUIs: false,
        },
        defaultChain: ACTIVE_CHAIN,
        supportedChains: [ACTIVE_CHAIN],
      }}
    >
      {/* Smart wallets (Kernel) — gas sponsored by the Pimlico paymaster
          configured in the Privy dashboard. Merchants transact with 0 ETH. */}
      <SmartWalletsProvider>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
        </QueryClientProvider>
      </SmartWalletsProvider>
    </PrivyProvider>
  );
}
