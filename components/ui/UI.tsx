"use client";
import { ReactNode, useState } from "react";
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import clsx from "clsx";

/* ── Spinner ──────────────────────────────────────────────────────────────── */
export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = { sm: "w-3.5 h-3.5 border-2", md: "w-5 h-5 border-2", lg: "w-8 h-8 border-[3px]" }[size];
  return (
    <div
      className={clsx("rounded-full flex-shrink-0", s)}
      style={{
        borderColor: "var(--line-strong)",
        borderTopColor: "var(--acc)",
        animation: "spin 0.75s linear infinite",
      }}
    />
  );
}

/* ── Theme Toggle ─────────────────────────────────────────────────────────── */
export function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  );

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 overflow-hidden"
      style={{
        background: dark ? "var(--acc)" : "var(--bg-sunken)",
        border: "1.5px solid var(--line-strong)",
      }}
      title={dark ? "Switch to light" : "Switch to dark"}
    >
      {/* Track icons */}
      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] select-none" style={{ opacity: dark ? 0 : 1, transition: "opacity 0.2s" }}>☀️</span>
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] select-none" style={{ opacity: dark ? 1 : 0, transition: "opacity 0.2s" }}>🌙</span>
      {/* Knob */}
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300"
        style={{
          background: dark ? "#fff" : "var(--acc)",
          left: dark ? "calc(100% - 20px)" : 3,
          boxShadow: dark ? "0 1px 4px rgba(0,0,0,0.4)" : "0 1px 4px rgba(249,115,22,0.4)",
        }}
      />
    </button>
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
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "var(--bg-overlay)" }}
        onClick={onClose}
      />
      <div
        className={clsx("relative w-full animate-slide-up overflow-y-auto", w)}
        style={{
          background: "var(--bg-card)",
          border: "1.5px solid var(--line-strong)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          maxHeight: "90vh",
        }}
      >
        {/* Orange top bar */}
        <div style={{ height: 3, background: "linear-gradient(90deg,var(--acc),var(--acc-2))", borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }} />
        <div
          className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
          style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--line)" }}
        >
          <div className="flex items-center gap-3">
            {/* Orange diamond icon */}
            <div className="w-7 h-7 rotate-45 flex-shrink-0" style={{ background: "var(--acc-subtle)", border: "1.5px solid var(--acc-border)", borderRadius: 4 }}>
              <div className="w-full h-full -rotate-45 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full" style={{ background: "var(--acc)" }} />
              </div>
            </div>
            <h2 className="font-display text-[20px] tracking-wide" style={{ color: "var(--tx)" }}>{title.toUpperCase()}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ color: "var(--tx-3)" }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "var(--err-bg)"; (e.currentTarget as HTMLElement).style.color = "var(--err)"; }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--tx-3)"; }}
          >
            <X size={15} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ── PageHeader ───────────────────────────────────────────────────────────── */
export function PageHeader({ title, subtitle, action, icon }: {
  title: string; subtitle?: string; action?: ReactNode; icon?: ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {icon && (
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--acc-subtle)", border: "1.5px solid var(--acc-border)", color: "var(--acc)" }}
            >
              {icon}
            </div>
          )}
          <div>
            <h1 className="font-display text-[38px] leading-none tracking-wide" style={{ color: "var(--tx)" }}>
              {title.toUpperCase()}
            </h1>
            {subtitle && (
              <p className="mt-1.5 text-[13px]" style={{ color: "var(--tx-2)", fontFamily: "var(--font-mono)" }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && <div className="flex-shrink-0 pt-1">{action}</div>}
      </div>
      {/* Accent underline */}
      <div className="mt-4 flex items-center gap-3">
        <div style={{ height: 2, width: 48, background: "var(--acc)", borderRadius: 99 }} />
        <div style={{ height: 2, flex: 1, background: "var(--line)" }} />
      </div>
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
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 hazard-stripe"
        style={{ border: "1.5px dashed var(--acc-border)", color: "var(--tx-3)" }}
      >
        {icon}
      </div>
      <h3 className="font-display text-[22px] tracking-wide mb-2" style={{ color: "var(--tx)" }}>
        {title.toUpperCase()}
      </h3>
      {description && (
        <p className="text-[13px] mb-6 max-w-xs" style={{ color: "var(--tx-2)", fontFamily: "var(--font-mono)" }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

/* ── Field ────────────────────────────────────────────────────────────────── */
export function Field({ label, error, required, children, hint }: {
  label: string; error?: string; required?: boolean; children: ReactNode; hint?: string;
}) {
  return (
    <div>
      <label className="label">
        {label}{required && <span style={{ color: "var(--acc)" }}>*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] mt-1" style={{ color: "var(--tx-3)", fontFamily: "var(--font-mono)" }}>{hint}</p>}
      {error && (
        <p className="text-[11.5px] mt-1.5 flex items-center gap-1.5" style={{ color: "var(--err)", fontFamily: "var(--font-mono)" }}>
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  );
}

/* ── StatCard — construction site tile ────────────────────────────────────── */
export function StatCard({ label, value, icon, sub, color = "orange", trend }: {
  label: string; value: string | number; icon: ReactNode; sub?: string;
  color?: "orange" | "green" | "blue" | "red" | "violet" | "yellow";
  trend?: { value: string; up: boolean };
}) {
  const palette: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    orange: { bg: "var(--acc-subtle)",   border: "var(--acc-border)", text: "var(--acc)",    glow: "rgba(249,115,22,0.2)" },
    green:  { bg: "var(--ok-bg)",        border: "rgba(22,163,74,0.3)", text: "var(--ok)",   glow: "rgba(22,163,74,0.2)" },
    blue:   { bg: "var(--info-bg)",      border: "rgba(37,99,235,0.3)", text: "var(--info)", glow: "rgba(37,99,235,0.2)" },
    red:    { bg: "var(--err-bg)",       border: "rgba(220,38,38,0.3)", text: "var(--err)",  glow: "rgba(220,38,38,0.2)" },
    violet: { bg: "var(--purple-bg)",    border: "rgba(124,58,237,0.3)", text: "var(--purple)", glow: "rgba(124,58,237,0.2)" },
    yellow: { bg: "var(--warn-bg)",      border: "rgba(217,119,6,0.3)", text: "var(--warn)", glow: "rgba(217,119,6,0.2)" },
  };
  const p = palette[color];

  return (
    <div
      className="kpi-tile group"
      style={{ cursor: "default" }}
    >
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden rounded-tr-2xl">
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: 0, height: 0,
          borderStyle: "solid",
          borderWidth: "0 48px 48px 0",
          borderColor: `transparent ${p.bg} transparent transparent`,
        }} />
      </div>
      <div className="flex items-start justify-between mb-4 relative">
        <div>
          <p className="label mb-0">{label}</p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
          style={{ background: p.bg, border: `1.5px solid ${p.border}`, color: p.text }}
        >
          {icon}
        </div>
      </div>
      <div className="font-display text-[36px] leading-none" style={{ color: "var(--tx)" }}>
        {value}
      </div>
      <div className="flex items-center justify-between mt-3">
        {sub && <p className="text-[12px]" style={{ color: "var(--tx-2)", fontFamily: "var(--font-mono)" }}>{sub}</p>}
        {trend && (
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: trend.up ? "var(--ok-bg)" : "var(--err-bg)",
              color: trend.up ? "var(--ok)" : "var(--err)",
            }}
          >
            {trend.up ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      {/* Animated bottom accent line */}
      <div
        className="absolute bottom-0 left-0 h-0.5 transition-all duration-300"
        style={{ width: "0%", background: p.text, borderRadius: "0 0 0 var(--radius-lg)" }}
        onMouseEnter={e => (e.currentTarget.style.width = "100%")}
        onMouseLeave={e => (e.currentTarget.style.width = "0%")}
      />
    </div>
  );
}

/* ── ConfirmDialog ────────────────────────────────────────────────────────── */
export function ConfirmDialog({ open, onClose, onConfirm, title, description, loading, danger = true }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; description?: string; loading?: boolean; danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      {description && (
        <p className="text-[14px] mb-6" style={{ color: "var(--tx-2)" }}>{description}</p>
      )}
      <div className="flex gap-3 justify-end">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button
          className={danger ? "btn btn-danger" : "btn btn-primary"}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading && <Spinner size="sm" />}Confirm
        </button>
      </div>
    </Modal>
  );
}

/* ── Alert ────────────────────────────────────────────────────────────────── */
export function Alert({ type, message }: { type: "error" | "success" | "info" | "warning"; message: string }) {
  const cfg = {
    error:   { bg: "var(--err-bg)",   border: "rgba(220,38,38,0.3)",   color: "var(--err)",    Icon: AlertCircle },
    success: { bg: "var(--ok-bg)",    border: "rgba(22,163,74,0.3)",   color: "var(--ok)",     Icon: CheckCircle2 },
    info:    { bg: "var(--info-bg)",  border: "rgba(37,99,235,0.3)",   color: "var(--info)",   Icon: Info },
    warning: { bg: "var(--warn-bg)",  border: "rgba(217,119,6,0.3)",   color: "var(--warn)",   Icon: AlertTriangle },
  }[type];
  const { Icon } = cfg;
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] mb-4"
      style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}`, color: cfg.color }}
    >
      <Icon size={15} className="flex-shrink-0" />{message}
    </div>
  );
}

/* ── SectionDivider ───────────────────────────────────────────────────────── */
export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div style={{ width: 20, height: 2, background: "var(--acc)", borderRadius: 99 }} />
      <span className="font-display text-[14px] tracking-widest" style={{ color: "var(--acc)" }}>
        {label.toUpperCase()}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
    </div>
  );
}
