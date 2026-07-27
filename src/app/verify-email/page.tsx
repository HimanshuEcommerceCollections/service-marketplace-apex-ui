"use client";

import "../auth.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "../lib/api-client";

type State = "verifying" | "ok" | "error" | "notoken";

export default function VerifyEmailPage() {
  const [state, setState] = useState<State>("verifying");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setState("notoken");
      return;
    }
    api("/auth/verify-email", { method: "POST", body: { token } })
      .then(() => setState("ok"))
      .catch((e) => {
        setState("error");
        setMsg(e instanceof ApiError ? e.message : "Verification failed");
      });
  }, []);

  return (
    <div className="auth">
      <div className="auth-wrap">
        <div className="auth-card">
          <h1>Email verification</h1>
          {state === "verifying" && <p className="auth-muted">Verifying your email…</p>}
          {state === "notoken" && <div className="auth-alert err">This verification link is invalid.</div>}
          {state === "error" && <div className="auth-alert err">{msg || "This link is invalid or has expired."}</div>}
          {state === "ok" && <div className="auth-alert ok">Your email is verified. Thank you!</div>}
          <p className="auth-foot"><Link href="/account">Go to my account →</Link></p>
        </div>
      </div>
    </div>
  );
}
