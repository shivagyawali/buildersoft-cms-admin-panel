"use client";
import { useQuery } from "@tanstack/react-query";
import { projectsApi, clientsApi, invoicesApi, workersApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { PageHeader, StatCard, Spinner } from "@/components/ui/UI";
import { Users, FolderKanban, FileText, TrendingUp, ArrowRight, HardHat } from "lucide-react";
import { formatCurrency, formatDate, getStatusColor, capitalize, extractArray } from "@/lib/utils";
import Link from "next/link";
import { Project, Invoice } from "@/types";
import clsx from "clsx";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: projData, isLoading: projLoading } = useQuery({ queryKey: ["dash-projects"], queryFn: () => projectsApi.list({ status: "active", limit: 6 }) });
  const { data: clientData } = useQuery({ queryKey: ["dash-clients"], queryFn: () => clientsApi.list({ limit: 1 }) });
  const { data: invData, isLoading: invLoading } = useQuery({ queryKey: ["dash-invoices"], queryFn: () => invoicesApi.list({ limit: 6 }) });
  const { data: workersData } = useQuery({ queryKey: ["dash-workers"], queryFn: () => workersApi.list({ limit: 100 }) });

  const projects: Project[] = extractArray<Project>(projData);
  const invoices: Invoice[] = extractArray<Invoice>(invData);
  const workers = extractArray(workersData);

  const totalClients = (clientData?.data as Record<string, unknown>)?.meta
    ? ((clientData?.data as Record<string, Record<string, unknown>>)?.meta?.total as number) ?? 0 : 0;

  const totalRevenue = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.totalAmount), 0);
  const pendingInvoices = invoices.filter((i) => ["sent", "viewed", "overdue", "partially_paid"].includes(i.status)).length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`${greeting}, ${user?.firstName ?? ""}!`}
        subtitle={formatDate(new Date().toISOString(), "EEEE, MMMM d, yyyy")}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Clients"     value={totalClients}             icon={<Users size={16} />}       sub="All time"          color="blue" />
        <StatCard label="Active Projects"   value={projects.length}          icon={<FolderKanban size={16} />} sub="Currently running" color="orange" />
        <StatCard label="Pending Invoices"  value={pendingInvoices}          icon={<FileText size={16} />}    sub="Awaiting payment"  color="amber" />
        <StatCard label="Revenue"           value={formatCurrency(totalRevenue)} icon={<TrendingUp size={16} />} sub="From paid invoices" color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Active Projects */}
        <div className="card">
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <span className="font-display font-bold text-sm" style={{ color: "var(--text-primary)" }}>Active Projects</span>
            <Link href="/projects" className="text-xs flex items-center gap-1 transition-colors" style={{ color: "var(--brand-500)" }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {projLoading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : projects.length === 0 ? (
            <p className="text-center text-sm py-10" style={{ color: "var(--text-tertiary)" }}>No active projects</p>
          ) : (
            <div style={{ divide: "border" }}>
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  onMouseOver={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-sunken)"}
                  onMouseOut={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}
                  >
                    <FolderKanban size={13} style={{ color: "var(--brand-500)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: "var(--text-primary)" }}>{p.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {p.expectedEndDate ? `Due ${formatDate(p.expectedEndDate)}` : "No deadline"}
                    </p>
                  </div>
                  <span className={clsx("badge", getStatusColor(p.priority))}>{capitalize(p.priority)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div className="card">
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <span className="font-display font-bold text-sm" style={{ color: "var(--text-primary)" }}>Recent Invoices</span>
            <Link href="/invoices" className="text-xs flex items-center gap-1 transition-colors" style={{ color: "var(--brand-500)" }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {invLoading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : invoices.length === 0 ? (
            <p className="text-center text-sm py-10" style={{ color: "var(--text-tertiary)" }}>No invoices yet</p>
          ) : (
            <div>
              {invoices.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/invoices/${inv.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  onMouseOver={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-sunken)"}
                  onMouseOut={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm font-mono" style={{ color: "var(--text-primary)" }}>{inv.invoiceNumber}</p>
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Due {formatDate(inv.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold font-display" style={{ color: "var(--text-primary)" }}>{formatCurrency(inv.totalAmount)}</p>
                    <span className={clsx("badge", getStatusColor(inv.status))}>{capitalize(inv.status)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Workers summary */}
      {workers.length > 0 && (
        <div className="card">
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <span className="font-display font-bold text-sm" style={{ color: "var(--text-primary)" }}>Workers</span>
            <Link href="/workers" className="text-xs flex items-center gap-1" style={{ color: "var(--brand-500)" }}>
              Manage <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-3 px-5 py-4">
            {(workers as any[]).slice(0, 10).map((w: any) => (
              <div
                key={w.id}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
                style={{
                  background: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)",
                }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold"
                  style={{ background: "rgba(249,115,22,0.12)", color: "var(--brand-500)" }}
                >
                  {w.firstName[0]}{w.lastName[0]}
                </div>
                <span>{w.firstName} {w.lastName}</span>
                {w.hourlyRate && <span style={{ color: "#10b981" }}>${Number(w.hourlyRate).toFixed(0)}/hr</span>}
              </div>
            ))}
            {workers.length > 10 && (
              <span className="text-xs self-center" style={{ color: "var(--text-tertiary)" }}>+{workers.length - 10} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
