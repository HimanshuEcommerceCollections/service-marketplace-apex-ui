"use client";

// Card payment for a booking. Mints a PaymentIntent via
// POST /payments/booking/:reference/intent (the server charges the STORED
// snapshot — grand total incl. tax; never recomputed at pay time) and renders
// Stripe's PaymentElement. The publishable key rides in the intent response, so
// the client needs no Stripe env of its own.

import { useEffect, useState } from "react";
import { loadStripe, type Stripe as StripeJs } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { api, ApiError } from "../../app/lib/api-client";

interface IntentResult {
  payment_id: string;
  client_secret: string | null;
  amount: number;
  subtotal: number;
  tax_amount: number;
  currency: string;
  publishable_key: string | null;
}

const money = (cents: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);

// One loadStripe per key for the whole app (Stripe.js must not be re-created).
const stripePromises = new Map<string, Promise<StripeJs | null>>();
const stripeFor = (key: string) => {
  if (!stripePromises.has(key)) stripePromises.set(key, loadStripe(key));
  return stripePromises.get(key)!;
};

function CheckoutForm({ intent, onPaid }: { intent: IntentResult; onPaid: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    if (!stripe || !elements) return;
    setBusy(true);
    setErr(null);
    // Card payments settle in-page; redirect-based methods bounce back to /my-bookings.
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/my-bookings?payment=success` },
      redirect: "if_required",
    });
    if (error) {
      setErr(error.message ?? "Payment failed. Please try again.");
      setBusy(false);
      return;
    }
    onPaid();
  }

  return (
    <div>
      <PaymentElement />
      <div className="pay-summary">
        <div>
          <span>Subtotal</span>
          <span>{money(intent.subtotal, intent.currency)}</span>
        </div>
        <div>
          <span>Tax</span>
          <span>{money(intent.tax_amount, intent.currency)}</span>
        </div>
        <div className="pay-total">
          <span>Total</span>
          <span>{money(intent.amount, intent.currency)}</span>
        </div>
      </div>
      {err && (
        <p className="pay-err" role="alert">
          {err}
        </p>
      )}
      <button type="button" className="pay-btn" onClick={() => void confirm()} disabled={busy || !stripe}>
        {busy ? "Processing…" : `Pay ${money(intent.amount, intent.currency)}`}
      </button>
    </div>
  );
}

export default function PayBooking({
  reference,
  onPaid,
  onError,
}: {
  reference: string;
  onPaid: () => void;
  /** Intent-creation failure (e.g. payments not configured) — payment UI is not shown. */
  onError?: (message: string) => void;
}) {
  const [intent, setIntent] = useState<IntentResult | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api<IntentResult>(`/payments/booking/${encodeURIComponent(reference)}/intent`, { method: "POST" })
      .then((r) => {
        if (!active) return;
        if (!r.client_secret || !r.publishable_key) {
          const msg = "Payments aren't available right now.";
          setErr(msg);
          onError?.(msg);
          return;
        }
        setIntent(r);
      })
      .catch((e) => {
        if (!active) return;
        const msg = e instanceof ApiError ? e.message : "Couldn't start the payment.";
        setErr(msg);
        onError?.(msg);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one intent per mount/reference
  }, [reference]);

  // stripeFor caches per key (module-level Map), so this is stable across renders
  // without manual memoization.
  const stripePromise = intent?.publishable_key ? stripeFor(intent.publishable_key) : null;

  if (err) return <p className="pay-err">{err}</p>;
  if (!intent || !stripePromise) return <p className="pay-loading">Preparing secure payment…</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret: intent.client_secret! }}>
      <CheckoutForm intent={intent} onPaid={onPaid} />
    </Elements>
  );
}
