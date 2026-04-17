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
  return `status-${status}`;
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

export function getPlanColor(plan: string): string {
  const map: Record<string, string> = {
    free: "#6b6050", starter: "#4a7fa5", pro: "#e8a020", enterprise: "#8e6bbf",
  };
  return map[plan] ?? "#6b6050";
}

export function getStatusBgColor(status: string): string {
  const map: Record<string, string> = {
    active: "rgba(61,153,112,0.14)", trial: "rgba(232,160,32,0.14)",
    suspended: "rgba(192,57,43,0.14)", inactive: "rgba(107,96,80,0.18)",
  };
  return map[status] ?? "rgba(107,96,80,0.18)";
}
