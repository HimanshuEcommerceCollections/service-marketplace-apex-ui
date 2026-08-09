"use client";

import "../auth.css";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api, ApiError } from "../lib/api-client";

type State = "verifying" | "ok" | "error" | "notoken";

function VerifyEmailInner() {
  // Read the token synchronously (Suspense-backed) and derive the initial state
  // from it, so the "no token" case needs no state-set in an effect.
  const token = useSearchParams().get("token");
  const [state, setState] = useState<State>(token ? "verifying" : "notoken");
  const [msg, setMsg] = useState<string>("");
  // The verify token is single-use. React Strict Mode double-invokes this mount
  // effect in development, and the second POST hits an already-consumed token and
  // would overwrite "ok" with an error. Fire the POST at most once per mount.
  const didRun = useRef(false);

  useEffect(() => {
    if (!token || didRun.current) return;
    didRun.current = true;
    api("/auth/verify-email", { method: "POST", body: { token } })
      .then(() => setState("ok"))
      .catch((e) => {
        setState("error");
        setMsg(e instanceof ApiError ? e.message : "Verification failed");
      });
  }, [token]);

  return (
    <div className="auth">
      <div className="auth-wrap">
        <div className="auth-card">
          <h1>Email verification</h1>
          {state === "verifying" && <p className="auth-muted">Verifying your email…</p>}
          {state === "notoken" && <div className="auth-alert err">This verification link is invalid.</div>}
          {state === "error" && <div className="auth-alert err">{msg || "This link is invalid or has expired."}</div>}
          {state === "ok" && <div className="auth-alert ok">Your email is verified. Thank you!</div>}
          <p className="auth-foot"><Link href="/my-bookings">Go to my bookings →</Link></p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="auth" />}>
      <VerifyEmailInner />
    </Suspense>
  );
}
