"use client";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { PageHeader, StatCard, Spinner } from "@/components/ui/UI";
import {
  Users, FolderKanban, FileText, TrendingUp, ArrowRight,
  HardHat, CheckSquare, Clock, AlertTriangle, Zap, 
  Building2, Activity, BarChart3, Wrench,
} from "lucide-react";
import { formatCurrency, formatDate, getStatusColor, capitalize, extractArray } from "@/lib/utils";
import Link from "next/link";
import clsx from "clsx";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: ["dash"], queryFn: dashboardApi.overview });
  const d = data?.data?.data ?? data?.data;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (isLoading || !d) return (
    <div className="flex justify-center py-24"><Spinner size="lg" /></div>
  );

  const monthly = d.monthlyRevenue ?? [];
  const maxRev = Math.max(...monthly.map((m: any) => Number(m.revenue)), 1);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Hero header with construction flair */}
      <div
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0d1117 0%, #1a2332 50%, #0d1117 100%)",
          border: "1.5px solid rgba(249,115,22,0.2)",
        }}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        {/* Top hazard stripe */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{
          background: "linear-gradient(90deg, var(--acc), var(--acc-2))"
        }} />
        {/* Faint hard hat watermark */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-5">
          <HardHat size={180} color="#f97316" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(249,115,22,0.7)" }}>
                ● SITE COMMAND ACTIVE
              </p>
              <h1 className="font-display text-[48px] leading-none tracking-wider text-white mb-2">
                {greeting.toUpperCase()},<br />
                <span style={{ color: "var(--acc)" }}>{user?.firstName?.toUpperCase() ?? "FOREMAN"}</span>
              </h1>
              <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                {formatDate(new Date().toISOString(), "EEEE, MMMM d, yyyy")} &nbsp;·&nbsp; BuilderSoft CMS
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center px-5 py-3 rounded-xl" style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)" }}>
                <div className="font-display text-[32px] text-white leading-none">{d.projects.active}</div>
                <div className="font-mono text-[10px] tracking-widest mt-1" style={{ color: "rgba(249,115,22,0.7)" }}>ACTIVE SITES</div>
              </div>
              <div className="text-center px-5 py-3 rounded-xl" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}>
                <div className="font-display text-[32px] text-white leading-none">{d.workers.active}</div>
                <div className="font-mono text-[10px] tracking-widest mt-1" style={{ color: "rgba(34,197,94,0.7)" }}>CREW ACTIVE</div>
              </div>
            </div>
          </div>

          {/* Status bar */}
          {d.invoices.overdue > 0 && (
            <div className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl w-fit" style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)" }}>
              <AlertTriangle size={14} style={{ color: "var(--err)" }} />
              <span className="text-[13px] font-medium" style={{ color: "var(--err)" }}>
                {d.invoices.overdue} overdue invoice{d.invoices.overdue > 1 ? "s" : ""} require attention
              </span>
            </div>
          )}
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard label="Total Clients"    value={d.clients.total}                     icon={<Users size={18}/>}       color="blue"   sub={`${d.clients.active} active`} />
        <StatCard label="Active Projects"  value={d.projects.active}                   icon={<FolderKanban size={18}/>}color="orange"  sub={`${d.projects.total} total`} />
        <StatCard label="Outstanding"      value={formatCurrency(d.invoices.outstanding)} icon={<FileText size={18}/>} color="yellow" sub={`${d.invoices.pending} pending`} />
        <StatCard label="Revenue Collected"value={formatCurrency(d.invoices.totalRevenue)} icon={<TrendingUp size={18}/>} color="green" sub={`${d.invoices.paid} paid`} />
      </div>

      {/* Row 2: Projects + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent projects — wide */}
        <div className="lg:col-span-7 card card-accent overflow-hidden">
          <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--line)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--acc-subtle)", border: "1px solid var(--acc-border)" }}>
                <FolderKanban size={15} style={{ color: "var(--acc)" }} />
              </div>
              <div>
                <h3 className="font-display text-[18px] tracking-wide" style={{ color: "var(--tx)" }}>ACTIVE PROJECTS</h3>
                <p className="font-mono text-[10px]" style={{ color: "var(--tx-3)" }}>{d.projects.total} total · {d.projects.active} running</p>
              </div>
            </div>
            <Link href="/projects" className="flex items-center gap-1.5 text-[12px] font-medium transition-colors" style={{ color: "var(--acc)" }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div>
            {d.recentProjects.length === 0 ? (
              <div className="py-12 text-center" style={{ color: "var(--tx-3)" }}>
                <FolderKanban size={32} className="mx-auto mb-2 opacity-30" />
                <p className="font-mono text-[12px] uppercase tracking-widest">No projects yet</p>
              </div>
            ) : (
              d.recentProjects.slice(0, 5).map((p: any, i: number) => (
                <Link key={p.id} href={`/projects/${p.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-all group"
                  style={{ borderBottom: "1px solid var(--line)" }}
                  onMouseOver={e => (e.currentTarget.style.background = "var(--acc-subtle)")}
                  onMouseOut={e => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Index */}
                  <div className="font-mono text-[11px] w-5 flex-shrink-0 text-center" style={{ color: "var(--tx-3)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {/* Color dot */}
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{
                    background: ["#f97316","#22c55e","#3b82f6","#f59e0b","#7c3aed"][i % 5]
                  }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[14px] truncate" style={{ color: "var(--tx)" }}>{p.name}</p>
                    <p className="text-[12px] font-mono truncate" style={{ color: "var(--tx-3)" }}>
                      {p.firstName} {p.lastName}{p.company ? ` · ${p.company}` : ""}
                    </p>
                  </div>
                  {/* Progress bar */}
                  {typeof p.progress === "number" && (
                    <div className="w-24 hidden sm:block">
                      <div className="progress-track">
                        <div className="progress-bar" style={{ width: `${p.progress}%` }} />
                      </div>
                      <p className="font-mono text-[10px] text-right mt-1" style={{ color: "var(--tx-3)" }}>{p.progress}%</p>
                    </div>
                  )}
                  <span className={clsx("badge", getStatusColor(p.status))}>{capitalize(p.status)}</span>
                  <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: "var(--acc)" }} />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Tasks + Workers — narrow */}
        <div className="lg:col-span-5 space-y-5">
          {/* Tasks overview */}
          <div className="card card-accent p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare size={16} style={{ color: "var(--acc)" }} />
                <h3 className="font-display text-[16px] tracking-wide" style={{ color: "var(--tx)" }}>TASK STATUS</h3>
              </div>
              <Link href="/tasks" className="text-[12px] font-medium" style={{ color: "var(--acc)" }}>Manage →</Link>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "To Do",       val: d.tasks.todo,        color: "var(--muted)" },
                { label: "In Progress", val: d.tasks.in_progress, color: "var(--acc)" },
                { label: "Review",      val: d.tasks.review,      color: "var(--info)" },
                { label: "Done",        val: d.tasks.done,        color: "var(--ok)" },
              ].map(({ label, val, color }) => (
                <div key={label} className="rounded-xl p-3" style={{ background: "var(--bg-raised)", border: "1px solid var(--line)" }}>
                  <div className="font-display text-[28px] leading-none" style={{ color }}>{val}</div>
                  <div className="font-mono text-[10px] tracking-wide mt-1" style={{ color: "var(--tx-3)" }}>{label}</div>
                </div>
              ))}
            </div>
            {d.tasks.total > 0 && (
              <div className="mt-4">
                <div className="flex justify-between font-mono text-[10px] mb-1.5" style={{ color: "var(--tx-3)" }}>
                  <span>Avg completion</span><span>{d.tasks.avgProgress}%</span>
                </div>
                <div className="progress-track"><div className="progress-bar" style={{ width: `${d.tasks.avgProgress}%` }} /></div>
              </div>
            )}
          </div>

          {/* Crew */}
          <div className="card card-accent p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HardHat size={16} style={{ color: "var(--acc)" }} />
                <h3 className="font-display text-[16px] tracking-wide" style={{ color: "var(--tx)" }}>CREW STATUS</h3>
              </div>
              <Link href="/workers" className="text-[12px] font-medium" style={{ color: "var(--acc)" }}>Roster →</Link>
            </div>
            <div className="flex items-center gap-4">
              {[
                { label: "Active",   val: d.workers.active,   color: "var(--ok)" },
                { label: "On Leave", val: d.workers.on_leave, color: "var(--warn)" },
                { label: "Inactive", val: d.workers.inactive, color: "var(--muted)" },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex-1 text-center">
                  <div className="font-display text-[32px] leading-none" style={{ color }}>{val}</div>
                  <div className="font-mono text-[10px] tracking-wide mt-1" style={{ color: "var(--tx-3)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Invoices + Revenue chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent invoices */}
        <div className="lg:col-span-5 card card-accent overflow-hidden">
          <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--line)" }}>
            <div className="flex items-center gap-2">
              <FileText size={16} style={{ color: "var(--acc)" }} />
              <h3 className="font-display text-[18px] tracking-wide" style={{ color: "var(--tx)" }}>RECENT INVOICES</h3>
            </div>
            <Link href="/invoices" className="text-[12px] font-medium" style={{ color: "var(--acc)" }}>All →</Link>
          </div>
          {d.recentInvoices.length === 0 ? (
            <div className="py-10 text-center" style={{ color: "var(--tx-3)" }}>
              <p className="font-mono text-[12px] uppercase tracking-widest">No invoices yet</p>
            </div>
          ) : (
            d.recentInvoices.slice(0, 5).map((inv: any, i: number) => (
              <Link key={inv.id} href={`/invoices/${inv.id}`}
                className="flex items-center gap-4 px-5 py-3.5 transition-all"
                style={{ borderBottom: "1px solid var(--line)" }}
                onMouseOver={e => (e.currentTarget.style.background = "var(--acc-subtle)")}
                onMouseOut={e => (e.currentTarget.style.background = "transparent")}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[12px] font-semibold" style={{ color: "var(--tx)" }}>{inv.invoiceNumber}</p>
                  <p className="text-[12px] truncate" style={{ color: "var(--tx-3)" }}>{inv.firstName} {inv.lastName}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-[16px]" style={{ color: "var(--tx)" }}>{formatCurrency(inv.totalAmount)}</p>
                  <span className={clsx("badge text-[10px]", getStatusColor(inv.status))}>{capitalize(inv.status)}</span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Revenue chart */}
        <div className="lg:col-span-7 card card-accent p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={16} style={{ color: "var(--acc)" }} />
            <h3 className="font-display text-[18px] tracking-wide" style={{ color: "var(--tx)" }}>MONTHLY REVENUE</h3>
          </div>
          {monthly.length === 0 ? (
            <div className="h-40 flex items-center justify-center">
              <p className="font-mono text-[12px] uppercase tracking-widest" style={{ color: "var(--tx-3)" }}>No data yet</p>
            </div>
          ) : (
            <>
              <div className="flex items-end gap-2 h-40 mb-2">
                {monthly.map((m: any, i: number) => {
                  const h = (Number(m.revenue) / maxRev) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="relative w-full group cursor-default">
                        {/* Billed bar (background) */}
                        <div className="w-full rounded-t-md transition-all" style={{
                          height: `${(Number(m.billed) / maxRev) * 160}px`,
                          background: "var(--line-strong)",
                          borderRadius: "6px 6px 0 0",
                        }} />
                        {/* Revenue bar (foreground, overlaid) */}
                        <div className="absolute bottom-0 left-0 right-0 rounded-t-md transition-all"
                          style={{
                            height: `${h}px`,
                            background: "linear-gradient(to top, var(--acc), var(--acc-2))",
                            borderRadius: "6px 6px 0 0",
                          }}
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className="px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap"
                            style={{ background: "var(--tx)", color: "var(--bg-card)", boxShadow: "var(--shadow-md)" }}>
                            {formatCurrency(m.revenue)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                {monthly.map((m: any, i: number) => (
                  <div key={i} className="flex-1 text-center font-mono text-[9px] truncate" style={{ color: "var(--tx-3)" }}>
                    {m.month?.slice(5)}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: "1px solid var(--line)" }}>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: "linear-gradient(var(--acc), var(--acc-2))" }} />
                  <span className="font-mono text-[10px]" style={{ color: "var(--tx-3)" }}>Collected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: "var(--line-strong)" }} />
                  <span className="font-mono text-[10px]" style={{ color: "var(--tx-3)" }}>Billed</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
