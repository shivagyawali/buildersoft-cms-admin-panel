import { format, parseISO, isValid } from "date-fns";

export function formatDate(date: string | Date | null | undefined, fmt = "MMM d, yyyy"): string {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return isValid(d) ? format(d, fmt) : "—";
  } catch { return "—"; }
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "$0.00";
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(Number(amount));
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    draft: "bg-gray-800 text-gray-400",
    sent: "bg-blue-950 text-blue-400",
    viewed: "bg-purple-950 text-purple-400",
    partially_paid: "bg-amber-950 text-amber-400",
    paid: "bg-emerald-950 text-emerald-400",
    overdue: "bg-red-950 text-red-400",
    cancelled: "bg-gray-900 text-gray-600",
    planning: "bg-gray-800 text-gray-400",
    active: "bg-emerald-950 text-emerald-400",
    on_hold: "bg-amber-950 text-amber-400",
    completed: "bg-blue-950 text-blue-400",
    todo: "bg-gray-800 text-gray-400",
    in_progress: "bg-blue-950 text-blue-400",
    review: "bg-purple-950 text-purple-400",
    done: "bg-emerald-950 text-emerald-400",
    low: "bg-gray-800 text-gray-500",
    medium: "bg-blue-950 text-blue-400",
    high: "bg-amber-950 text-amber-400",
    urgent: "bg-red-950 text-red-400",
    inactive: "bg-gray-900 text-gray-600",
  };
  return map[status] ?? "bg-gray-800 text-gray-400";
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getInitials(first: string, last: string): string {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

export function getErrMsg(err: unknown): string {
  const e = err as { response?: { data?: { message?: string | string[] } } };
  const msg = e?.response?.data?.message;
  if (Array.isArray(msg)) return msg[0];
  return msg ?? "Something went wrong";
}

export function extractArray<T>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (typeof data !== "object" || data === null) return [];
  const d = data as Record<string, unknown>;
  if ("data" in d && d.data !== undefined) return extractArray(d.data);
  for (const key in d) {
    if (Array.isArray(d[key])) return d[key] as T[];
  }
  for (const key in d) {
    if (typeof d[key] === "object" && d[key] !== null) {
      const arr: T[] = extractArray(d[key]);
      if (arr.length > 0) return arr;
    }
  }
  return [];
}
