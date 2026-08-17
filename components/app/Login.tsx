"use client";

import { useEffect, useState } from "react";
import { useData } from "@/lib/store/store-context";
import { DEMO_CREDENTIALS } from "@/lib/auth/mock-auth";

export default function Login() {
  const { authReady, isAuthenticated, authUser, login } = useData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authReady || !isAuthenticated || !authUser) return;
    const target = authUser.role === "CLIENT" ? "/portal" : "/dashboard";
    window.location.replace(target);
  }, [authReady, isAuthenticated, authUser]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    // Small delay so the button state reads as "signing in…"
      window.setTimeout(() => {
        const result = login(email, password);
        if (!result.ok) {
          setError(result.error);
          setSubmitting(false);
          return;
        }
        const current = window.location.pathname;
        const isClient = result.user!.role === "CLIENT";
        const isAppPath = /^\/(dashboard|portal)(\/|$)/.test(current);
        let target: string;
        if (isClient) {
          target = current.startsWith("/portal") ? current : "/portal";
        } else {
          target = isAppPath ? current : "/dashboard";
        }
        window.location.replace(target);
      }, 250);
  };

  const fill = (userId: string, userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError(null);
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <img src="/images/aureus-technologies-logo.png" alt="" />
          <span>
            <b>AUREUS</b>
            <small>PM SUITE — SIGN IN</small>
          </span>
        </div>

        <h1>Sign in</h1>
        <p className="auth-sub">
          Access the project dashboard or your client portal. Choose a demo account
          below or enter a credential manually.
        </p>

        <form onSubmit={submit} className="auth-form">
          <label className="form-label" htmlFor="auth-email">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            className="form-control"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
          <label className="form-label" htmlFor="auth-password">
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            className="form-control"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && (
            <div className="auth-error" role="alert">
              <i className="bi bi-exclamation-circle me-1"></i>
              {error}
            </div>
          )}

          <button type="submit" className="btn-auth" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="auth-demo">
          <div className="auth-demo-title">Demo accounts</div>
          <div className="auth-demo-grid">
            {DEMO_CREDENTIALS.map((cred) => {
              const emailValue =
                cred.userId === "u-admin"
                  ? "dev@aureustechnologies.com"
                  : cred.userId === "u-dev"
                    ? "dilan@aureustechnologies.com"
                    : cred.userId === "u-dev2"
                      ? "ishara@aureustechnologies.com"
                      : cred.userId === "u-client1"
                        ? "ravindu@fleeve.lk"
                        : "nimali@jayasuriyacorp.com";
              return (
                <button
                  key={cred.userId}
                  type="button"
                  className="auth-demo-item"
                  onClick={() => fill(cred.userId, emailValue, cred.password)}
                >
                  <span className="auth-demo-label">{cred.label}</span>
                  <span className="auth-demo-creds">
                    {emailValue} / {cred.password}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <a className="auth-back" href="/">
          <i className="bi bi-arrow-left me-1"></i> Back to site
        </a>
      </div>
    </div>
  );
}
