"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useData } from "@/lib/store/store-context";
import { DEMO_CREDENTIALS } from "@/lib/auth/mock-auth";
import { SHOW_DEMO_LOGINS } from "@/lib/env";

const DEMO_EMAILS: Record<string, string> = {
  "u-superadmin": "esmunasinghe@gmail.com",
  "u-admin": "dev@aureustechnologies.com",
  "u-dev": "dilan@aureustechnologies.com",
  "u-dev2": "ishara@aureustechnologies.com",
  "u-client1": "ravindu@fleeve.lk",
  "u-client2": "nimali@jayasuriyacorp.com",
};

const HIGHLIGHTS = [
  {
    icon: "bi-kanban",
    title: "Plan and track delivery",
    text: "Kanban boards, sprints and milestones in one workspace.",
  },
  {
    icon: "bi-stopwatch",
    title: "Time that adds up",
    text: "Live timers and manual entries, rolled into clear reports.",
  },
  {
    icon: "bi-people",
    title: "Clients kept close",
    text: "A dedicated portal with progress clients can trust.",
  },
];

export default function Login() {
  const { authReady, isAuthenticated, authUser, login } = useData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

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

  const fill = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError(null);
  };

  return (
    <div className="auth-screen">
      <aside className="auth-side">
        <div className="auth-side-brand">
          <img src="/images/aureus-technologies-logo.png" alt="" />
          <span>
            <b>AUREUS</b>
            <small>PM SUITE</small>
          </span>
        </div>

        <div className="auth-side-body">
          <h2>
            Where work becomes <em>delivery.</em>
          </h2>
          <ul className="auth-points">
            {HIGHLIGHTS.map((item) => (
              <li key={item.title} className="auth-point">
                <i className={`bi ${item.icon}`}></i>
                <div>
                  <b>{item.title}</b>
                  <span>{item.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <small className="auth-side-foot">
          © {new Date().getFullYear()} Aureus Technologies — internal workspace
        </small>
      </aside>

      <main className="auth-panel">
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
            Use your workspace credentials to access the dashboard or client portal.
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
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="auth-alt">
            New client? <Link href="/signup">Create an account</Link>
          </p>

          {SHOW_DEMO_LOGINS && (
            <>
              <button
                type="button"
                className="auth-demo-toggle"
                onClick={() => setShowDemo((s) => !s)}
                aria-expanded={showDemo}
              >
                <i className="bi bi-key"></i> Demo access
                <i className={`bi bi-chevron-down ms-auto${showDemo ? " rotated" : ""}`}></i>
              </button>

              {showDemo && (
                <div className="auth-demo-grid">
                  {DEMO_CREDENTIALS.map((cred) => {
                    const emailValue = DEMO_EMAILS[cred.userId] ?? "";
                    return (
                      <button
                        key={cred.userId}
                        type="button"
                        className="auth-demo-item"
                        onClick={() => fill(emailValue, cred.password)}
                      >
                        <span className="auth-demo-text">
                          <span className="auth-demo-label">{cred.label}</span>
                          <span className="auth-demo-creds">
                            {emailValue} · {cred.password}
                          </span>
                        </span>
                        <i className="bi bi-arrow-right-short"></i>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          <a className="auth-back" href="/">
            <i className="bi bi-arrow-left me-1"></i> Back to site
          </a>
        </div>
      </main>
    </div>
  );
}
