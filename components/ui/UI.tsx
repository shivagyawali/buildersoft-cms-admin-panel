"use client";
import { ReactNode } from "react";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

/* ── Modal ─────────────────────────────────────────────────────── */
export function Modal({
  open, onClose, title, children, size = "md",
}: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; size?: "sm" | "md" | "lg" | "xl";
}) {
  if (!open) return null;
  const w = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" }[size];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose} />
      <div
        className={clsx("relative w-full animate-slide-up overflow-y-auto", w)}
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
          borderRadius: "20px",
          boxShadow: "var(--shadow-lg)",
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 sticky top-0 z-10 rounded-t-[20px]"
          style={{
            background: "var(--bg-elevated)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <h2 className="font-display font-bold text-base" style={{ color: "var(--text-primary)" }}>{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-all"
            style={{ color: "var(--text-tertiary)" }}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-sunken)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
            onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-tertiary)"; }}
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ── Spinner ────────────────────────────────────────────────────── */
export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = { sm: "w-4 h-4 border-2", md: "w-6 h-6 border-2", lg: "w-8 h-8 border-[3px]" }[size];
  return (
    <div
      className={clsx("rounded-full animate-spin", s)}
      style={{ borderColor: "var(--border-default)", borderTopColor: "var(--brand-500)" }}
    />
  );
}

/* ── PageHeader ─────────────────────────────────────────────────── */
export function PageHeader({ title, subtitle, action }: {
  title: string; subtitle?: string; action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/* ── EmptyState ─────────────────────────────────────────────────── */
export function EmptyState({ icon, title, description, action }: {
  icon: ReactNode; title: string; description?: string; action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "var(--bg-sunken)", border: "1px solid var(--border-default)", color: "var(--text-tertiary)" }}
      >
        {icon}
      </div>
      <h3 className="font-medium text-sm mb-1" style={{ color: "var(--text-secondary)" }}>{title}</h3>
      {description && <p className="text-sm mb-5 max-w-xs" style={{ color: "var(--text-tertiary)" }}>{description}</p>}
      {action}
    </div>
  );
}

/* ── Field ──────────────────────────────────────────────────────── */
export function Field({ label, error, required, children }: {
  label: string; error?: string; required?: boolean; children: ReactNode;
}) {
  return (
    <div>
      <label className="label">
        {label}{required && <span className="ml-0.5" style={{ color: "var(--brand-500)" }}>*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#f87171" }}>
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  );
}

/* ── StatCard ───────────────────────────────────────────────────── */
export function StatCard({ label, value, icon, sub, color = "orange" }: {
  label: string; value: string | number; icon: ReactNode; sub?: string; color?: string;
}) {
  const iconBg: Record<string, { bg: string; color: string; border: string }> = {
    orange:  { bg: "rgba(249,115,22,0.1)",  color: "var(--brand-500)", border: "rgba(249,115,22,0.2)" },
    emerald: { bg: "rgba(16,185,129,0.1)",  color: "#10b981",          border: "rgba(16,185,129,0.2)" },
    blue:    { bg: "rgba(59,130,246,0.1)",  color: "#3b82f6",           border: "rgba(59,130,246,0.2)" },
    amber:   { bg: "rgba(245,158,11,0.1)",  color: "#f59e0b",           border: "rgba(245,158,11,0.2)" },
    violet:  { bg: "rgba(139,92,246,0.1)",  color: "#8b5cf6",           border: "rgba(139,92,246,0.2)" },
  };
  const ic = iconBg[color] ?? iconBg.orange;
  return (
    <div className="card p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <span className="label mb-0">{label}</span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: ic.bg, color: ic.color, border: `1px solid ${ic.border}` }}
        >
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold font-display" style={{ color: "var(--text-primary)" }}>{value}</div>
      {sub && <div className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>{sub}</div>}
    </div>
  );
}

/* ── ConfirmDialog ──────────────────────────────────────────────── */
export function ConfirmDialog({ open, onClose, onConfirm, title, description, loading }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; description?: string; loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      {description && <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>{description}</p>}
      <div className="flex gap-3 justify-end">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
          {loading && <Spinner size="sm" />}Delete
        </button>
      </div>
    </Modal>
  );
}

/* ── Alert ──────────────────────────────────────────────────────── */
export function Alert({ type, message }: { type: "error" | "success"; message: string }) {
  const isError = type === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;
  return (
    <div
      className="px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2"
      style={{
        background: isError ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)",
        border: `1px solid ${isError ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}`,
        color: isError ? "#f87171" : "#34d399",
      }}
    >
      <Icon size={14} className="flex-shrink-0" />{message}
    </div>
  );
}

/* ── WorkerPopup ─────────────────────────────────────────────────── */
export function WorkerPopup({ worker, onClose }: { worker: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose} />
      <div
        className="relative w-full max-w-sm animate-slide-up p-6"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
          borderRadius: "20px",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-all"
          style={{ color: "var(--text-tertiary)" }}
        >
          <X size={16} />
        </button>
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base font-display"
            style={{
              background: "rgba(249,115,22,0.12)",
              border: "1px solid rgba(249,115,22,0.25)",
              color: "var(--brand-400)",
            }}
          >
            {worker.firstName?.[0]}{worker.lastName?.[0]}
          </div>
          <div>
            <p className="font-bold font-display" style={{ color: "var(--text-primary)" }}>{worker.firstName} {worker.lastName}</p>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{worker.role}</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: "Email", value: worker.email },
            { label: "Phone", value: worker.phone },
          ].filter(r => r.value).map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span style={{ color: "var(--text-tertiary)" }}>{label}</span>
              <span style={{ color: "var(--text-primary)" }}>{value}</span>
            </div>
          ))}
          {worker.hourlyRate != null && (
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-tertiary)" }}>Hourly Rate</span>
              <span className="font-semibold" style={{ color: "#34d399" }}>${Number(worker.hourlyRate).toFixed(2)}/hr</span>
            </div>
          )}
          {worker.overtimeRate != null && (
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-tertiary)" }}>Overtime Rate</span>
              <span className="font-semibold" style={{ color: "var(--brand-400)" }}>${Number(worker.overtimeRate).toFixed(2)}/hr</span>
            </div>
          )}
          <div className="flex justify-between text-sm items-center">
            <span style={{ color: "var(--text-tertiary)" }}>Status</span>
            <span className={clsx("badge", worker.status === "active" ? "status-active" : "status-inactive")}>
              {worker.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
