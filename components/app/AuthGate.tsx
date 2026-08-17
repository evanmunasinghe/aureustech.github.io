"use client";

import type { ReactNode } from "react";
import { useData } from "@/lib/store/store-context";
import Login from "@/components/app/Login";
import { QuickSearch } from "@/components/app/QuickSearch";

export function AuthGate({ children }: { children: ReactNode }) {
  const { authReady, isAuthenticated } = useData();

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
    return <Login />;
  }

  return (
    <>
      {children}
      <QuickSearch />
    </>
  );
}
