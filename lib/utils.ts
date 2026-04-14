import { format, parseISO, isValid } from "date-fns";

export function formatDate(
  date: string | Date | null | undefined,
  fmt = "MMM d, yyyy"
): string {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return isValid(d) ? format(d, fmt) : "—";
  } catch {
    return "—";
  }
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "$0.00";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(Number(amount));
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    draft: "bg-stone-100 text-stone-600",
    sent: "bg-blue-50 text-blue-700",
    viewed: "bg-purple-50 text-purple-700",
    partially_paid: "bg-amber-50 text-amber-700",
    paid: "bg-emerald-50 text-emerald-700",
    overdue: "bg-red-50 text-red-700",
    cancelled: "bg-stone-100 text-stone-400",
    planning: "bg-stone-100 text-stone-600",
    active: "bg-emerald-50 text-emerald-700",
    on_hold: "bg-amber-50 text-amber-700",
    completed: "bg-blue-50 text-blue-700",
    todo: "bg-stone-100 text-stone-600",
    in_progress: "bg-blue-50 text-blue-700",
    review: "bg-purple-50 text-purple-700",
    done: "bg-emerald-50 text-emerald-700",
    low: "bg-stone-100 text-stone-500",
    medium: "bg-blue-50 text-blue-600",
    high: "bg-amber-50 text-amber-700",
    urgent: "bg-red-50 text-red-700",
  };
  return map[status] ?? "bg-stone-100 text-stone-600";
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getInitials(first: string, last: string): string {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

export function getErrMsg(err: unknown): string {
  const e = err as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message ?? "Something went wrong";
}
