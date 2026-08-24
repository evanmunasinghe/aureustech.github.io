"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useData } from "@/lib/store/store-context";

const CLIENT_POINTS = [
  {
    icon: "bi-graph-up-arrow",
    title: "Follow live progress",
    text: "Milestones, deliverables and timelines — always current.",
  },
  {
    icon: "bi-patch-check",
    title: "Approve in one click",
    text: "Review finished work and sign off without leaving the portal.",
  },
  {
    icon: "bi-chat-dots",
    title: "A direct line to the team",
    text: "Comments and updates land where you can see them.",
  },
];

export default function Signup() {
  const { authReady, isAuthenticated, registerClient } = useData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authReady || !isAuthenticated) return;
    window.location.replace("/portal");
  }, [authReady, isAuthenticated]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      const result = registerClient({ name, email, password });
      if (!result.ok) {
        setError(result.error);
        setSubmitting(false);
        return;
      }
      window.location.replace("/portal");
    }, 250);
  };

  return (
    <div className="auth-screen">
      <aside className="auth-side">
        <div className="auth-side-brand">
          <img src="/images/aureus-technologies-logo.png" alt="" />
          <span>
            <b>AUREUS</b>
            <small>CLIENT PORTAL</small>
          </span>
        </div>

        <div className="auth-side-body">
          <h2>
            Your project, <em>in clear view.</em>
          </h2>
          <ul className="auth-points">
            {CLIENT_POINTS.map((item) => (
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
          © {new Date().getFullYear()} Aureus Technologies — client workspace
        </small>
      </aside>

      <main className="auth-panel">
        <div className="auth-card">
          <div className="auth-brand">
            <img src="/images/aureus-technologies-logo.png" alt="" />
            <span>
              <b>AUREUS</b>
              <small>CLIENT PORTAL — SIGN UP</small>
            </span>
          </div>

          <h1>Create your account</h1>
          <p className="auth-sub">
            Set up a client account to follow your project&apos;s progress, approve
            deliverables and talk to the team.
          </p>

          <form onSubmit={submit} className="auth-form">
            <label className="form-label" htmlFor="signup-name">
              Full name
            </label>
            <input
              id="signup-name"
              type="text"
              className="form-control"
              placeholder="Jane Perera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
            <label className="form-label" htmlFor="signup-email">
              Work email
            </label>
            <input
              id="signup-email"
              type="email"
              className="form-control"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <label className="form-label" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              className="form-control"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
            <label className="form-label" htmlFor="signup-confirm">
              Confirm password
            </label>
            <input
              id="signup-confirm"
              type="password"
              className="form-control"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
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
                  Creating account…
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus me-2"></i>Create account
                </>
              )}
            </button>
          </form>

          <p className="auth-alt">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>

          <a className="auth-back" href="/">
            <i className="bi bi-arrow-left me-1"></i> Back to site
          </a>
        </div>
      </main>
    </div>
  );
}
