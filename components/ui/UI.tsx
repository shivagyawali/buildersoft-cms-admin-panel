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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className={clsx(
        "relative bg-[#16161e] border border-white/10 rounded-2xl shadow-2xl w-full animate-slide-up overflow-y-auto max-h-[90vh]",
        w
      )}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] sticky top-0 bg-[#16161e] rounded-t-2xl z-10">
          <h2 className="font-display font-600 text-white text-base">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/8 transition-all">
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
  return <div className={clsx("rounded-full animate-spin border-white/10 border-t-violet-500", s)} />;
}

/* ── PageHeader ─────────────────────────────────────────────────── */
export function PageHeader({ title, subtitle, action }: {
  title: string; subtitle?: string; action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
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
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-4 text-gray-600">
        {icon}
      </div>
      <h3 className="font-medium text-gray-400 mb-1 text-sm">{title}</h3>
      {description && <p className="text-sm text-gray-600 mb-5 max-w-xs">{description}</p>}
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
        {label}{required && <span className="text-violet-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

/* ── StatCard ───────────────────────────────────────────────────── */
export function StatCard({ label, value, icon, sub, color = "violet" }: {
  label: string; value: string | number; icon: ReactNode; sub?: string; color?: string;
}) {
  const colors: Record<string, string> = {
    violet: "from-violet-500/10 to-violet-600/5 border-violet-500/20 text-violet-400",
    emerald: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
    blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400",
    amber: "from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-400",
  };
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest">{label}</span>
        <div className={clsx("w-9 h-9 rounded-xl bg-gradient-to-br border flex items-center justify-center", colors[color] ?? colors.violet)}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-display font-700 text-white">{value}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </div>
  );
}

/* ── ConfirmDialog ──────────────────────────────────────────────── */
export function ConfirmDialog({ open, onClose, onConfirm, title, description, loading }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; description?: string; loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      {description && <p className="text-sm text-gray-400 mb-5">{description}</p>}
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
  const styles = type === "error"
    ? "bg-red-950/40 border-red-900/50 text-red-400"
    : "bg-emerald-950/40 border-emerald-900/50 text-emerald-400";
  const Icon = type === "error" ? AlertCircle : CheckCircle2;
  return (
    <div className={clsx("px-4 py-3 rounded-xl border text-sm mb-4 flex items-center gap-2", styles)}>
      <Icon size={14} className="flex-shrink-0" />{message}
    </div>
  );
}

/* ── WorkerPopup ─────────────────────────────────────────────────── */
export function WorkerPopup({ worker, onClose }: { worker: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#16161e] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm animate-slide-up p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/8 transition-all">
          <X size={16} />
        </button>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 font-display font-700 text-base">
            {worker.firstName?.[0]}{worker.lastName?.[0]}
          </div>
          <div>
            <p className="font-display font-600 text-white">{worker.firstName} {worker.lastName}</p>
            <p className="text-xs text-gray-500">{worker.role}</p>
          </div>
        </div>
        <div className="space-y-3">
          {worker.email && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Email</span>
              <span className="text-gray-300">{worker.email}</span>
            </div>
          )}
          {worker.phone && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Phone</span>
              <span className="text-gray-300">{worker.phone}</span>
            </div>
          )}
          {worker.hourlyRate != null && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Hourly Rate</span>
              <span className="text-emerald-400 font-semibold">${Number(worker.hourlyRate).toFixed(2)}/hr</span>
            </div>
          )}
          {worker.overtimeRate != null && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Overtime Rate</span>
              <span className="text-amber-400 font-semibold">${Number(worker.overtimeRate).toFixed(2)}/hr</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className={clsx("badge", worker.status === "active" ? "bg-emerald-950 text-emerald-400" : "bg-gray-800 text-gray-500")}>
              {worker.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
