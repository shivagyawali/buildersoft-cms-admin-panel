"use client";
import { ReactNode } from "react";
import { X, AlertCircle, CheckCircle2, Building2, TrendingUp, Users, FolderKanban, FileText, HardHat } from "lucide-react";
import clsx from "clsx";

/* ── Spinner ──────────────────────────────────────────────────────────────── */
export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = { sm: "w-3.5 h-3.5 border-2", md: "w-5 h-5 border-2", lg: "w-7 h-7 border-[3px]" }[size];
  return (
    <div
      className={clsx("rounded-full animate-spin flex-shrink-0", s)}
      style={{ borderColor: "var(--ln2)", borderTopColor: "var(--am)" }}
    />
  );
}

/* ── Modal ────────────────────────────────────────────────────────────────── */
export function Modal({ open, onClose, title, children, size = "md" }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; size?: "sm" | "md" | "lg" | "xl";
}) {
  if (!open) return null;
  const w = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" }[size];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <div
        className={clsx("relative w-full animate-slide-up overflow-y-auto", w)}
        style={{
          background: "var(--c2)",
          border: "1px solid var(--ln2)",
          borderTop: "2px solid var(--am)",
          borderRadius: 2,
          boxShadow: "var(--shadow-lg)",
          maxHeight: "90vh",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
          style={{ background: "var(--c2)", borderBottom: "1px solid var(--ln)" }}
        >
          <h2
            className="font-display font-bold text-[15px] uppercase tracking-[0.06em]"
            style={{ color: "var(--t1)" }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center transition-all"
            style={{ color: "var(--t3)", border: "1px solid var(--ln)", borderRadius: 2 }}
            onMouseOver={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--am)";
              (e.currentTarget as HTMLElement).style.color = "var(--am)";
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--ln)";
              (e.currentTarget as HTMLElement).style.color = "var(--t3)";
            }}
          >
            <X size={13} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ── PageHeader ───────────────────────────────────────────────────────────── */
export function PageHeader({ title, subtitle, action }: {
  title: string; subtitle?: string; action?: ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && (
            <p className="mt-1.5 text-[13px]" style={{ color: "var(--t2)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div className="hairline-strong mt-5" />
    </div>
  );
}

/* ── EmptyState ───────────────────────────────────────────────────────────── */
export function EmptyState({ icon, title, description, action }: {
  icon: ReactNode; title: string; description?: string; action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div
        className="w-12 h-12 flex items-center justify-center mb-4"
        style={{ background: "var(--c3)", border: "1px solid var(--ln2)", color: "var(--t3)", borderRadius: 2 }}
      >
        {icon}
      </div>
      <h3 className="font-display font-bold text-[13px] uppercase tracking-[0.08em] mb-1" style={{ color: "var(--t2)" }}>
        {title}
      </h3>
      {description && (
        <p className="text-[12.5px] mb-5 max-w-xs" style={{ color: "var(--t3)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

/* ── Field ────────────────────────────────────────────────────────────────── */
export function Field({ label, error, required, children }: {
  label: string; error?: string; required?: boolean; children: ReactNode;
}) {
  return (
    <div>
      <label className="label">
        {label}
        {required && <span className="ml-0.5" style={{ color: "var(--am)" }}>*</span>}
      </label>
      {children}
      {error && (
        <p className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: "var(--err)", fontFamily: "var(--font-mono)" }}>
          <AlertCircle size={10} />{error}
        </p>
      )}
    </div>
  );
}

/* ── StatCard ─────────────────────────────────────────────────────────────── */
export function StatCard({ label, value, icon, sub, color = "amber" }: {
  label: string; value: string | number; icon: ReactNode; sub?: string; color?: string;
}) {
  const colors: Record<string, { text: string; bg: string; border: string }> = {
    amber:   { text: "var(--am)",     bg: "var(--am3)",             border: "rgba(232,160,32,0.25)" },
    green:   { text: "var(--ok)",     bg: "var(--ok-bg)",           border: "rgba(61,153,112,0.25)" },
    blue:    { text: "var(--bl)",     bg: "var(--bl2)",             border: "rgba(74,127,165,0.25)" },
    red:     { text: "var(--err)",    bg: "var(--err-bg)",          border: "rgba(192,57,43,0.25)" },
    violet:  { text: "var(--violet)", bg: "var(--violet-bg)",       border: "rgba(142,107,191,0.25)" },
    orange:  { text: "var(--am)",     bg: "var(--am3)",             border: "rgba(232,160,32,0.25)" },
    emerald: { text: "var(--ok)",     bg: "var(--ok-bg)",           border: "rgba(61,153,112,0.25)" },
  };
  const c = colors[color] ?? colors.amber;
  return (
    <div className="kpi">
      <div className="kpi-label">
        <span>{label}</span>
        <div
          className="w-7 h-7 flex items-center justify-center flex-shrink-0"
          style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, borderRadius: 2 }}
        >
          {icon}
        </div>
      </div>
      <div className="kpi-value">{value}</div>
      {sub && (
        <div className="mt-2" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--t3)", letterSpacing: "0.08em" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

/* ── ConfirmDialog ────────────────────────────────────────────────────────── */
export function ConfirmDialog({ open, onClose, onConfirm, title, description, loading }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; description?: string; loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      {description && (
        <p className="text-[13px] mb-6" style={{ color: "var(--t2)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
          {description}
        </p>
      )}
      <div className="flex gap-3 justify-end">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
          {loading && <Spinner size="sm" />}Delete
        </button>
      </div>
    </Modal>
  );
}

/* ── Alert ────────────────────────────────────────────────────────────────── */
export function Alert({ type, message }: { type: "error" | "success" | "info" | "warning"; message: string }) {
  const styles: Record<string, { bg: string; border: string; color: string }> = {
    error:   { bg: "var(--err-bg)",    border: "rgba(192,57,43,0.3)",    color: "#e05a4e" },
    success: { bg: "var(--ok-bg)",     border: "rgba(61,153,112,0.3)",   color: "var(--ok)" },
    info:    { bg: "var(--info-bg)",   border: "rgba(74,127,165,0.3)",   color: "var(--bl)" },
    warning: { bg: "var(--warn-bg)",   border: "rgba(232,160,32,0.3)",   color: "var(--am)" },
  };
  const st = styles[type] ?? styles.info;
  const Icon = type === "error" ? AlertCircle : CheckCircle2;
  return (
    <div
      className="px-4 py-3 text-[12.5px] mb-4 flex items-center gap-2"
      style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color, borderRadius: 2, fontFamily: "var(--font-mono)" }}
    >
      <Icon size={13} className="flex-shrink-0" />{message}
    </div>
  );
}

/* ── WorkerPopup ──────────────────────────────────────────────────────────── */
export function WorkerPopup({ worker, onClose }: { worker: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.7)" }} onClick={onClose} />
      <div
        className="relative w-full max-w-sm animate-slide-up p-6"
        style={{ background: "var(--c2)", border: "1px solid var(--ln2)", borderTop: "2px solid var(--am)", borderRadius: 2, boxShadow: "var(--shadow-lg)" }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 btn btn-ghost p-1.5">
          <X size={14} />
        </button>
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-11 h-11 flex items-center justify-center font-display font-bold text-base"
            style={{ background: "var(--am3)", border: "1px solid rgba(232,160,32,0.3)", color: "var(--am)", borderRadius: 2 }}
          >
            {worker.firstName?.[0]}{worker.lastName?.[0]}
          </div>
          <div>
            <p className="font-display font-bold text-[15px] uppercase tracking-[0.04em]" style={{ color: "var(--t1)" }}>
              {worker.firstName} {worker.lastName}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] mt-0.5" style={{ color: "var(--t3)" }}>
              {worker.role}
            </p>
          </div>
        </div>
        <div className="space-y-2.5">
          {[
            { label: "Email",  value: worker.email },
            { label: "Phone",  value: worker.phone },
            { label: "Status", value: worker.status },
          ].filter(r => r.value).map(({ label, value }) => (
            <div key={label} className="flex justify-between text-[13px]" style={{ borderBottom: "1px solid var(--ln)", paddingBottom: 8 }}>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--t3)" }}>{label}</span>
              <span style={{ color: "var(--t1)" }}>{value}</span>
            </div>
          ))}
          {worker.hourlyRate != null && (
            <div className="flex justify-between text-[13px]" style={{ borderBottom: "1px solid var(--ln)", paddingBottom: 8 }}>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--t3)" }}>Hourly Rate</span>
              <span className="font-display font-bold" style={{ color: "var(--ok)" }}>${Number(worker.hourlyRate).toFixed(2)}/hr</span>
            </div>
          )}
          {worker.overtimeRate != null && (
            <div className="flex justify-between text-[13px]">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--t3)" }}>OT Rate</span>
              <span className="font-display font-bold" style={{ color: "var(--am)" }}>${Number(worker.overtimeRate).toFixed(2)}/hr</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── PlanBadge ────────────────────────────────────────────────────────────── */
export function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    free:       { bg: "rgba(107,96,80,0.18)", color: "#6b6050" },
    starter:    { bg: "rgba(74,127,165,0.18)", color: "#4a7fa5" },
    pro:        { bg: "rgba(232,160,32,0.14)", color: "#e8a020" },
    enterprise: { bg: "rgba(142,107,191,0.15)", color: "#8e6bbf" },
  };
  const s = styles[plan] ?? styles.free;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] font-semibold"
      style={{ background: s.bg, color: s.color, borderRadius: 2 }}
    >
      {plan}
    </span>
  );
}

/* ── CompanyStatusBadge ───────────────────────────────────────────────────── */
export function CompanyStatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    active:    { bg: "var(--ok-bg)",   color: "var(--ok)" },
    trial:     { bg: "var(--am3)",     color: "var(--am)" },
    suspended: { bg: "var(--err-bg)",  color: "var(--err)" },
    inactive:  { bg: "var(--muted-bg)", color: "var(--muted)" },
  };
  const s = styles[status] ?? styles.inactive;
  return (
    <span className="badge" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}
