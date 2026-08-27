"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ConfirmationProvider } from "@/components/confirmation-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ConfirmationProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            theme="dark"
            expand={true}
            toastOptions={{
              className: "border-slate-700 bg-slate-900 text-slate-100",
            }}
          />
        </ConfirmationProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
