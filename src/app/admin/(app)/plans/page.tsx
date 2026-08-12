"use client";

// Plans — admin-composed purchasable plans: service + cadence + up-to-4 bullets
// + a BINDING pre-tax price. Subscribing to a plan charges exactly this price;
// the configurator never touches it. Replaces the old free-text recurring cards.

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../../lib/api";
import { ConfirmModal, type ConfirmRequest } from "../../components/modal";
import { TableSkeleton } from "../../components/skeleton";

type PriceType = "PER_VISIT" | "PER_MONTH" | "FLAT";
type Status = "ACTIVE" | "INACTIVE";

interface ServiceOption { id: string; name: string; slug: string }
interface Cadence { id: string; key: string; label: string; status: Status }
interface Plan {
  id: string;
  serviceId: string;
  serviceName: string;
  cadenceId: string;
  cadenceLabel: string;
  name: string;
  bullets: string[];
  price: number;
  priceType: PriceType;
  featured: boolean;
  status: Status;
}

const PRICE_TYPES: { v: PriceType; label: string }[] = [
  { v: "PER_VISIT", label: "per visit" },
  { v: "PER_MONTH", label: "per month" },
  { v: "FLAT", label: "flat" },
];

const c2d = (c: number) => (c / 100).toFixed(2);

export default function PlansPage() {
  // null = first load in flight (skeleton); [] = genuinely empty.
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [cadences, setCadences] = useState<Cadence[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // create/edit form — editingId null = create mode; set = the plan being edited
  // (the service is locked while editing: a plan cannot move between services).
  const [editingId, setEditingId] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState("");
  const [cadenceId, setCadenceId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState<PriceType>("PER_VISIT");
  const [bullets, setBullets] = useState("");
  const [featured, setFeatured] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);

  const fetchAll = useCallback(
    () =>
      Promise.all([
        api<Plan[]>("/admin/catalog/plans"),
        api<Cadence[]>("/admin/catalog/cadences"),
        api<ServiceOption[]>("/services"),
      ]),
    [],
  );

  const apply = useCallback(([p, c, s]: [Plan[], Cadence[], ServiceOption[]]) => {
    setPlans(p);
    setCadences(c.filter((x) => x.status === "ACTIVE"));
    setServices(s);
    setErr(null);
  }, []);

  const load = useCallback(
    () => fetchAll().then(apply).catch((e) => setErr(e instanceof ApiError ? e.message : "Failed to load plans")),
    [fetchAll, apply],
  );

  useEffect(() => {
    // setState only from promise callbacks — never synchronously in the effect.
    fetchAll().then(apply).catch((e) => setErr(e instanceof ApiError ? e.message : "Failed to load plans"));
  }, [fetchAll, apply]);

  function parsedBullets(): string[] {
    return bullets
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean)
      .slice(0, 4);
  }

  function resetForm() {
    setEditingId(null);
    setServiceId("");
    setCadenceId("");
    setName("");
    setPrice("");
    setPriceType("PER_VISIT");
    setBullets("");
    setFeatured(false);
  }

  function startEdit(p: Plan) {
    setEditingId(p.id);
    setServiceId(p.serviceId);
    setCadenceId(p.cadenceId);
    setName(p.name);
    setPrice(c2d(p.price));
    setPriceType(p.priceType);
    setBullets(p.bullets.join("\n"));
    setFeatured(p.featured);
    setErr(null);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /** Create in create mode; PATCH the edited plan in edit mode (service is locked). */
  function askSave() {
    if (!serviceId || !cadenceId || !name.trim() || !price) {
      setErr("Service, cadence, name and price are required.");
      return;
    }
    const dollars = Number(price);
    if (!Number.isFinite(dollars) || dollars <= 0) {
      setErr("Enter a positive price.");
      return;
    }
    setErr(null);
    const serviceName = services.find((s) => s.id === serviceId)?.name ?? "—";
    const cadenceLabel = cadences.find((c) => c.id === cadenceId)?.label ?? "—";
    const typeLabel = PRICE_TYPES.find((t) => t.v === priceType)?.label ?? priceType;
    setConfirm({
      title: editingId ? `Save plan — ${name.trim()}` : `Create plan — ${name.trim()}`,
      body: (
        <>
          {editingId ? "Save" : "Create"} <b>{name.trim()}</b> ({serviceName}, {cadenceLabel}) at{" "}
          <b>${dollars.toFixed(2)} {typeLabel}</b>? The price is BINDING — subscribers are charged exactly this
          (pre-tax), and the plan is publicly visible while ACTIVE.
        </>
      ),
      confirmLabel: editingId ? "Save plan" : "Create plan",
      action: async () => {
        const body = {
          cadenceId,
          name: name.trim(),
          bullets: parsedBullets(),
          price: Math.round(dollars * 100),
          priceType,
          featured,
        };
        if (editingId) {
          await api(`/admin/catalog/plans/${editingId}`, { method: "PATCH", body });
          setNotice("Plan updated.");
        } else {
          await api("/admin/catalog/plans", { method: "POST", body: { ...body, serviceId } });
          setNotice("Plan created.");
        }
        resetForm();
        await load();
      },
    });
  }

  function askPatch(p: Plan, body: Record<string, unknown>, summary: string, danger = false) {
    setConfirm({
      title: `${summary} — ${p.name}`,
      danger,
      body: (
        <>
          {summary} <b>{p.name}</b> ({p.serviceName}, {p.cadenceLabel})? This changes what customers see on the site.
        </>
      ),
      confirmLabel: summary,
      action: async () => {
        await api(`/admin/catalog/plans/${p.id}`, { method: "PATCH", body });
        setNotice("Plan updated.");
        await load();
      },
    });
  }

  return (
    <>
      {err && <div className="ax-alert err">{err}</div>}
      {notice && <div className="ax-alert ok">{notice}</div>}

      <div className="ax-card">
        <h3>{editingId ? `Edit plan — ${name || "…"}` : "Create plan"}</h3>
        <p className="ax-muted" style={{ marginTop: 2 }}>
          The price is BINDING — subscribing to a plan charges exactly this (pre-tax), regardless of configuration.
          {editingId ? " A plan can't move between services — create a new plan instead." : ""}
        </p>
        <div className="ax-row" style={{ gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          <select
            className="ax-select"
            style={{ maxWidth: 190 }}
            value={serviceId}
            disabled={editingId != null}
            onChange={(e) => setServiceId(e.target.value)}
          >
            <option value="">— service —</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select className="ax-select" style={{ maxWidth: 170 }} value={cadenceId} onChange={(e) => setCadenceId(e.target.value)}>
            <option value="">— cadence —</option>
            {cadences.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <input className="ax-input" style={{ maxWidth: 200 }} placeholder="Plan name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="ax-input" style={{ width: 110 }} placeholder="Price $" value={price} onChange={(e) => setPrice(e.target.value)} />
          <select className="ax-select" style={{ maxWidth: 130 }} value={priceType} onChange={(e) => setPriceType(e.target.value as PriceType)}>
            {PRICE_TYPES.map((t) => (
              <option key={t.v} value={t.v}>{t.label}</option>
            ))}
          </select>
          <label className="ax-row" style={{ gap: 6, alignItems: "center", fontSize: 13 }}>
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> most popular
          </label>
        </div>
        <div className="ax-field" style={{ marginTop: 10, maxWidth: 480 }}>
          <label>Bullet points (one per line, max 4)</label>
          <textarea
            className="ax-input"
            rows={4}
            placeholder={"Mow, edge, trim & blow\nSeasonal height adjustments\nPriority weather rescheduling\nSame crew each visit"}
            value={bullets}
            onChange={(e) => setBullets(e.target.value)}
          />
        </div>
        <div className="ax-row" style={{ gap: 8, marginTop: 10 }}>
          <button className="ax-btn" onClick={askSave}>
            {editingId ? "Save changes" : "Create plan"}
          </button>
          {editingId && (
            <button className="ax-btn ghost" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="ax-table-wrap" style={{ marginTop: 16 }}>
      <table className="ax-table">
        <thead>
          <tr><th>Plan</th><th>Service</th><th className="ax-hide-md">Cadence</th><th>Price</th><th className="ax-hide-md">Bullets</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          {plans === null && !err && <TableSkeleton cols={7} />}
          {(plans ?? []).map((p) => (
            <tr key={p.id} style={p.status === "INACTIVE" ? { opacity: 0.55 } : undefined}>
              <td>
                {p.name} {p.featured && <span className="ax-badge ok">most popular</span>}
              </td>
              <td className="ax-muted">{p.serviceName}</td>
              <td className="ax-muted ax-hide-md">{p.cadenceLabel}</td>
              <td>
                ${c2d(p.price)}{" "}
                <span className="ax-muted">{PRICE_TYPES.find((t) => t.v === p.priceType)?.label}</span>
              </td>
              <td style={{ maxWidth: 280 }} className="ax-hide-md">
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, lineHeight: 1.7 }} className="ax-muted">
                  {p.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </td>
              <td>
                <span className={`ax-badge ${p.status === "ACTIVE" ? "ok" : "muted"}`}>{p.status}</span>
              </td>
              <td>
                <div className="ax-row" style={{ gap: 6 }}>
                  <button className="ax-btn ghost sm" onClick={() => startEdit(p)}>
                    Edit
                  </button>
                  <button className="ax-btn ghost sm" onClick={() => askPatch(p, { featured: !p.featured }, p.featured ? "Unfeature" : "Feature")}>
                    {p.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    className="ax-btn ghost sm"
                    onClick={() =>
                      askPatch(
                        p,
                        { status: p.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" },
                        p.status === "ACTIVE" ? "Deactivate" : "Activate",
                        p.status === "ACTIVE",
                      )
                    }
                  >
                    {p.status === "ACTIVE" ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {plans !== null && plans.length === 0 && <tr><td colSpan={7} className="ax-muted">No plans yet — create the first one above.</td></tr>}
        </tbody>
      </table>
      </div>

      <ConfirmModal req={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}
