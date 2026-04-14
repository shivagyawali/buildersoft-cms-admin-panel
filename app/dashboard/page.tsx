"use client";
import { useQuery } from "@tanstack/react-query";
import { projectsApi, clientsApi, invoicesApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { PageHeader, StatCard, Spinner } from "@/components/ui/UI";
import { Users, FolderKanban, FileText, TrendingUp, ArrowRight } from "lucide-react";
import { formatCurrency, formatDate, getStatusColor, capitalize } from "@/lib/utils";
import Link from "next/link";
import { Project, Invoice } from "@/types";
import clsx from "clsx";

function extractArray<T>(data: unknown): T[] {
  if (!data) return [];
  const d = data as Record<string, unknown>;
  // handle: { data: { data: [...] } }
  if (d?.data && typeof d.data === "object") {
    const inner = d.data as Record<string, unknown>;
    if (Array.isArray(inner.data)) return inner.data as T[];
    if (Array.isArray(inner)) return inner as T[];
  }
  // handle: { data: [...] }
  if (Array.isArray(d?.data)) return d.data as T[];
  // handle: [...]
  if (Array.isArray(d)) return d as T[];
  return [];
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: projData, isLoading: projLoading } = useQuery({
    queryKey: ["dash-projects"],
    queryFn: () => projectsApi.list({ status: "active", limit: 6 }),
  });
  const { data: clientData } = useQuery({
    queryKey: ["dash-clients"],
    queryFn: () => clientsApi.list({ limit: 1 }),
  });
  const { data: invData, isLoading: invLoading } = useQuery({
    queryKey: ["dash-invoices"],
    queryFn: () => invoicesApi.list({ limit: 6 }),
  });

  const projects: Project[] = extractArray<Project>(projData);
  const invoices: Invoice[] = extractArray<Invoice>(invData);

  const totalClients =
    (clientData?.data as Record<string, unknown>)?.meta
      ? ((clientData?.data as Record<string, Record<string, unknown>>)?.meta?.total as number) ?? 0
      : 0;

  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + Number(i.totalAmount), 0);

  const pendingInvoices = invoices.filter((i) =>
    ["sent", "viewed", "overdue", "partially_paid"].includes(i.status)
  ).length;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`${greeting}, ${user?.firstName ?? ""}!`}
        subtitle={formatDate(new Date().toISOString(), "EEEE, MMMM d, yyyy")}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Clients" value={totalClients} icon={<Users size={16} />} sub="All time" />
        <StatCard label="Active Projects" value={projects.length} icon={<FolderKanban size={16} />} sub="Currently running" />
        <StatCard label="Pending Invoices" value={pendingInvoices} icon={<FileText size={16} />} sub="Awaiting payment" />
        <StatCard label="Revenue" value={formatCurrency(totalRevenue)} icon={<TrendingUp size={16} />} sub="From paid invoices" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <span className="font-semibold text-stone-800">Active Projects</span>
            <Link href="/projects" className="text-xs text-amber-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {projLoading ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : projects.length === 0 ? (
            <p className="text-center text-stone-400 text-sm py-10">No active projects</p>
          ) : (
            <div className="divide-y divide-stone-50">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-stone-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <FolderKanban size={14} className="text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-800 text-sm truncate">{p.name}</p>
                    <p className="text-xs text-stone-400">
                      {p.expectedEndDate
                        ? `Due ${formatDate(p.expectedEndDate)}`
                        : "No deadline"}
                    </p>
                  </div>
                  <span className={clsx("badge", getStatusColor(p.priority))}>
                    {capitalize(p.priority)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <span className="font-semibold text-stone-800">Recent Invoices</span>
            <Link href="/invoices" className="text-xs text-amber-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {invLoading ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : invoices.length === 0 ? (
            <p className="text-center text-stone-400 text-sm py-10">No invoices yet</p>
          ) : (
            <div className="divide-y divide-stone-50">
              {invoices.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/invoices/${inv.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-800 text-sm font-mono">
                      {inv.invoiceNumber}
                    </p>
                    <p className="text-xs text-stone-400">Due {formatDate(inv.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-stone-800">
                      {formatCurrency(inv.totalAmount)}
                    </p>
                    <span className={clsx("badge", getStatusColor(inv.status))}>
                      {capitalize(inv.status)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}