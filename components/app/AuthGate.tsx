"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useData } from "@/lib/store/store-context";
import Login from "@/components/app/Login";
import { QuickSearch } from "@/components/app/QuickSearch";

const PUBLIC_PATHS = ["/login", "/signup"];

export function AuthGate({ children }: { children: ReactNode }) {
  const { authReady, isAuthenticated } = useData();
  const pathname = usePathname();

  if (!authReady) {
    return (
      <div className="auth-screen">
        <div className="auth-loading">
          <div className="spinner-border spinner-border-sm" role="status"></div>
          <span>Loading workspace…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
      return <>{children}</>;
    }
    return <Login />;
  }

  return (
    <>
      {children}
      <QuickSearch />
    </>
  );
}
