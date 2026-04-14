"use client";
import { ReactNode } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

/* ── Modal ─────────────────────────────────────────────────────── */
export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  if (!open) return null;
  const w = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" }[size];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative bg-white rounded-2xl shadow-2xl w-full animate-slide-up overflow-y-auto max-h-[90vh]",
          w
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="font-semibold text-stone-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all"
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
      className={clsx(
        "rounded-full animate-spin border-stone-200 border-t-amber-600",
        s
      )}
    />
  );
}

/* ── PageHeader ─────────────────────────────────────────────────── */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="text-stone-400 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/* ── EmptyState ─────────────────────────────────────────────────── */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
        {icon}
      </div>
      <h3 className="font-medium text-stone-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-stone-400 mb-5 max-w-xs">{description}</p>
      )}
      {action}
    </div>
  );
}

/* ── Field ──────────────────────────────────────────────────────── */
export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/* ── StatCard ───────────────────────────────────────────────────── */
export function StatCard({
  label,
  value,
  icon,
  sub,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  sub?: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">
          {label}
        </span>
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-display text-stone-900">{value}</div>
      {sub && <div className="text-xs text-stone-400 mt-1">{sub}</div>}
    </div>
  );
}

/* ── ConfirmDialog ──────────────────────────────────────────────── */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      {description && (
        <p className="text-sm text-stone-500 mb-5">{description}</p>
      )}
      <div className="flex gap-3 justify-end">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
          {loading && <Spinner size="sm" />}
          Delete
        </button>
      </div>
    </Modal>
  );
}

/* ── Alert ──────────────────────────────────────────────────────── */
export function Alert({
  type,
  message,
}: {
  type: "error" | "success";
  message: string;
}) {
  const styles =
    type === "error"
      ? "bg-red-50 border-red-200 text-red-700"
      : "bg-emerald-50 border-emerald-200 text-emerald-700";
  return (
    <div className={clsx("px-4 py-3 rounded-lg border text-sm mb-4", styles)}>
      {message}
    </div>
  );
}
