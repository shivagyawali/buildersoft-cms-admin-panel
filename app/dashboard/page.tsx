"use client";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { PageHeader, StatCard, Spinner } from "@/components/ui/UI";
import { Users, FolderKanban, FileText, TrendingUp, ArrowUpRight, HardHat, CheckSquare, Share2 } from "lucide-react";
import { formatCurrency, formatDate, getStatusColor, capitalize, extractArray } from "@/lib/utils";
import Link from "next/link";
import { DashboardData } from "@/types";
import clsx from "clsx";

export default function DashboardPage() {
  const { user, isSuperAdmin } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn:  () => dashboardApi.overview(),
  });

  const d: DashboardData | null = data?.data?.data ?? data?.data ?? null;

  const today = new Date();
  const todayStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase();

  if (isLoading || !d) {
    return (
      <div className="flex items-center justify-center py-32 relative z-10">
        <Spinner size="lg" />
      </div>
    );
  }

  // Sparkline SVG helper
  const Spark = ({ data: vals, color }: { data: number[]; color: string }) => {
    const max = Math.max(...vals, 1);
    const points = vals.map((v, i) => `${(i / (vals.length - 1)) * 90},${38 - (v / max) * 34}`).join(" ");
    const fill   = [...points.split(" "), "90,38", "0,38"].join(" ");
    return (
      <svg width="90" height="38" viewBox="0 0 90 38" preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points={fill} fill={color} opacity="0.08" />
      </svg>
    );
  };

  const monthlyVals   = (d.monthlyRevenue ?? []).map((m: any) => Number(m.revenue));
  const monthlyBilled = (d.monthlyRevenue ?? []).map((m: any) => Number(m.billed));

  return (
    <div className="animate-fade-in relative z-10 flex flex-col gap-6">

      {/* Header strip */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="page-sub mb-1">{todayStr}</div>
          <h1 className="page-title">
            {isSuperAdmin ? "Platform Overview" : `Site Report`}
          </h1>
        </div>
        <Link href={isSuperAdmin ? "/companies" : "/projects"} className="btn btn-primary">
          <Share2 size={13} />
          {isSuperAdmin ? "Manage Companies" : "New Project"}
        </Link>
      </div>
      <div className="hairline-strong" />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[color:var(--ln)] border border-[color:var(--ln)] stagger">
        <div className="kpi !border-0 !rounded-none">
          <div className="kpi-label">
            <span>Total Clients</span>
            <Users size={13} style={{ color: "var(--bl)" }} />
          </div>
          <div className="kpi-value">{d.clients.total.toString().padStart(2, "0")}</div>
          <div className="mt-2 flex items-end justify-between">
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--t3)" }}>
              {d.clients.active} active
            </div>
            <Spark data={monthlyVals.length ? monthlyVals : [1,2,3,4,5]} color="var(--bl)" />
          </div>
        </div>
        <div className="kpi !border-0 !rounded-none">
          <div className="kpi-label">
            <span>Active Projects</span>
            <FolderKanban size={13} style={{ color: "var(--am)" }} />
          </div>
          <div className="kpi-value">{d.projects.active.toString().padStart(2, "0")}</div>
          <div className="mt-2 flex items-end justify-between">
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--t3)" }}>
              {d.projects.total} total
            </div>
            <Spark data={[d.projects.planning, d.projects.active, d.projects.on_hold, d.projects.completed]} color="var(--am)" />
          </div>
        </div>
        <div className="kpi !border-0 !rounded-none">
          <div className="kpi-label">
            <span>Outstanding</span>
            <FileText size={13} style={{ color: "var(--warn)" }} />
          </div>
          <div className="kpi-value">{formatCurrency(d.invoices.outstanding)}</div>
          <div className="mt-2 flex items-end justify-between">
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--t3)" }}>
              {d.invoices.pending} pending
            </div>
            <Spark data={monthlyBilled.length ? monthlyBilled : [1,2,3,4,5]} color="var(--warn)" />
          </div>
        </div>
        <div className="kpi !border-0 !rounded-none">
          <div className="kpi-label">
            <span>Revenue</span>
            <TrendingUp size={13} style={{ color: "var(--ok)" }} />
          </div>
          <div className="kpi-value">{formatCurrency(d.invoices.totalRevenue)}</div>
          <div className="mt-2 flex items-end justify-between">
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--t3)" }}>
              {d.invoices.paid} paid
            </div>
            <Spark data={monthlyVals.length ? monthlyVals : [1,2,3,4,5]} color="var(--ok)" />
          </div>
        </div>
      </div>

      {/* Row 2: Projects + Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">
        {/* Projects */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--ln)" }}>
            <span className="font-display font-bold text-[14px] uppercase tracking-[0.08em]" style={{ color: "var(--t1)" }}>
              Recent Projects
            </span>
            <Link href="/projects" className="flex items-center gap-1.5 transition-colors" style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--t3)" }}
              onMouseOver={e => (e.currentTarget.style.color = "var(--am)")}
              onMouseOut={e => (e.currentTarget.style.color = "var(--t3)")}
            >
              View all <ArrowUpRight size={11} />
            </Link>
          </div>
          {d.recentProjects.length === 0 ? (
            <p className="text-center py-10 font-mono text-[10.5px] uppercase tracking-widest" style={{ color: "var(--t3)" }}>No projects yet</p>
          ) : (
            d.recentProjects.slice(0, 6).map((p: any, i: number) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="flex items-center gap-4 px-5 py-4 transition-colors"
                style={{ borderBottom: i < d.recentProjects.length - 1 ? "1px solid var(--ln)" : "none" }}
                onMouseOver={e => (e.currentTarget.style.background = "var(--c3)")}
                onMouseOut={e => (e.currentTarget.style.background = "transparent")}
              >
                <div className="font-mono text-[10px] w-6 text-center flex-shrink-0" style={{ color: "var(--t3)" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-[14px] uppercase tracking-[0.03em] truncate" style={{ color: "var(--t1)" }}>{p.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] mt-0.5" style={{ color: "var(--t3)" }}>
                    {p.firstName} {p.lastName}{p.company ? ` · ${p.company}` : ""}
                  </p>
                </div>
                {typeof p.progress === "number" && (
                  <div className="w-20 hidden sm:block">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${p.progress}%` }} />
                    </div>
                    <div className="font-mono text-[9.5px] mt-1 text-right" style={{ color: "var(--t3)" }}>{p.progress}%</div>
                  </div>
                )}
                <span className={clsx("badge", getStatusColor(p.status))}>{capitalize(p.status)}</span>
                <ArrowUpRight size={13} style={{ color: "var(--t3)", flexShrink: 0 }} />
              </Link>
            ))
          )}
        </div>

        {/* Invoices */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--ln)" }}>
            <span className="font-display font-bold text-[14px] uppercase tracking-[0.08em]" style={{ color: "var(--t1)" }}>
              Recent Invoices
            </span>
            <Link href="/invoices" className="flex items-center gap-1.5 transition-colors" style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--t3)" }}
              onMouseOver={e => (e.currentTarget.style.color = "var(--am)")}
              onMouseOut={e => (e.currentTarget.style.color = "var(--t3)")}
            >
              View all <ArrowUpRight size={11} />
            </Link>
          </div>
          {d.recentInvoices.length === 0 ? (
            <p className="text-center py-10 font-mono text-[10.5px] uppercase tracking-widest" style={{ color: "var(--t3)" }}>No invoices yet</p>
          ) : (
            d.recentInvoices.slice(0, 6).map((inv: any, i: number) => (
              <Link
                key={inv.id} href={`/invoices/${inv.id}`}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors"
                style={{ borderBottom: i < d.recentInvoices.length - 1 ? "1px solid var(--ln)" : "none" }}
                onMouseOver={e => (e.currentTarget.style.background = "var(--c3)")}
                onMouseOut={e => (e.currentTarget.style.background = "transparent")}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[11px] tracking-[0.06em]" style={{ color: "var(--t2)" }}>{inv.invoiceNumber}</p>
                  <p className="text-[12.5px] truncate mt-0.5" style={{ color: "var(--t1)" }}>
                    {inv.firstName} {inv.lastName}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-display font-bold text-[15px]" style={{ color: "var(--t1)" }}>
                    {formatCurrency(inv.totalAmount)}
                  </p>
                  <span className={clsx("badge mt-1", getStatusColor(inv.status))}>{capitalize(inv.status)}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Row 3: Tasks + Workers summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Tasks overview */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-display font-bold text-[14px] uppercase tracking-[0.08em]" style={{ color: "var(--t1)" }}>
              Tasks Overview
            </span>
            <Link href="/tasks" className="btn btn-secondary text-[11px] py-1.5 px-3">View tasks</Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "To Do",       val: d.tasks.todo,        color: "var(--muted)" },
              { label: "In Progress", val: d.tasks.in_progress, color: "var(--am)" },
              { label: "Done",        val: d.tasks.done,        color: "var(--ok)" },
            ].map(({ label, val, color }) => (
              <div key={label} className="p-3" style={{ background: "var(--c3)", borderRadius: 2, border: "1px solid var(--ln)" }}>
                <div className="font-display font-bold text-[22px]" style={{ color }}>{val}</div>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] mt-1" style={{ color: "var(--t3)" }}>{label}</div>
              </div>
            ))}
          </div>
          {d.tasks.total > 0 && (
            <div className="mt-4">
              <div className="flex justify-between mb-1.5" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--t3)" }}>
                <span>Avg Progress</span>
                <span>{d.tasks.avgProgress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${d.tasks.avgProgress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Workers */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-display font-bold text-[14px] uppercase tracking-[0.08em]" style={{ color: "var(--t1)" }}>
              Crew Status
            </span>
            <Link href="/workers" className="btn btn-secondary text-[11px] py-1.5 px-3">Manage crew</Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Active",   val: d.workers.active,   color: "var(--ok)" },
              { label: "On Leave", val: d.workers.on_leave, color: "var(--warn)" },
              { label: "Inactive", val: d.workers.inactive, color: "var(--muted)" },
            ].map(({ label, val, color }) => (
              <div key={label} className="p-3" style={{ background: "var(--c3)", borderRadius: 2, border: "1px solid var(--ln)" }}>
                <div className="font-display font-bold text-[22px]" style={{ color }}>{val}</div>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] mt-1" style={{ color: "var(--t3)" }}>{label}</div>
              </div>
            ))}
          </div>
          {/* Revenue chart bars */}
          {d.monthlyRevenue.length > 0 && (
            <div className="mt-4">
              <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] mb-2" style={{ color: "var(--t3)" }}>Monthly Revenue</div>
              <div className="flex items-end gap-1" style={{ height: 40 }}>
                {d.monthlyRevenue.map((m: any, i: number) => {
                  const max = Math.max(...d.monthlyRevenue.map((x: any) => Number(x.revenue)), 1);
                  const h = (Number(m.revenue) / max) * 36;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <div title={formatCurrency(m.revenue)} style={{ height: h, background: "var(--am)", width: "100%", borderRadius: 1, transition: "height 0.4s ease", minHeight: 2 }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
