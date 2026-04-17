"use client";
import { useQuery } from "@tanstack/react-query";
import { superadminApi } from "@/lib/api";
import { PageHeader, Spinner, PlanBadge, CompanyStatusBadge } from "@/components/ui/UI";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight, Building2, Users, FolderKanban, FileText, HardHat, TrendingUp } from "lucide-react";

export default function SuperAdminPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["superadmin-overview"],
    queryFn:  () => superadminApi.overview(),
  });
  const d = data?.data?.data ?? data?.data ?? null;

  if (isLoading || !d) return (
    <div className="flex items-center justify-center py-32 relative z-10"><Spinner size="lg"/></div>
  );

  return (
    <div className="animate-fade-in relative z-10 flex flex-col gap-6">
      <PageHeader title="Platform Overview" subtitle="All companies · All data" />

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-[color:var(--ln)] border border-[color:var(--ln)] stagger">
        {[
          { label: "Companies",  value: d.companies.total,            icon: <Building2 size={13}/>, color: "var(--am)",     sub: `${d.companies.active} active` },
          { label: "Users",      value: d.users.total,                icon: <Users size={13}/>,     color: "var(--bl)",     sub: `${d.users.active} active` },
          { label: "Projects",   value: d.projects.total,             icon: <FolderKanban size={13}/>, color: "var(--ok)",  sub: `${d.projects.active} running` },
          { label: "Billed",     value: formatCurrency(d.invoices.totalBilled), icon: <FileText size={13}/>, color: "var(--warn)", sub: formatCurrency(d.invoices.outstanding) + " outstanding" },
          { label: "Workers",    value: d.workers.total,              icon: <HardHat size={13}/>,   color: "var(--violet)", sub: `${d.workers.active} active` },
        ].map(({ label, value, icon, color, sub }) => (
          <div key={label} className="kpi !border-0 !rounded-none">
            <div className="kpi-label">
              <span>{label}</span>
              <span style={{ color }}>{icon}</span>
            </div>
            <div className="kpi-value">{String(value)}</div>
            <div className="mt-1.5 font-mono text-[10px]" style={{ color: "var(--t3)" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Plan breakdown */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { plan: "free",       count: d.companies.byPlan.free,       color: "var(--muted)" },
          { plan: "starter",    count: d.companies.byPlan.starter,    color: "var(--bl)" },
          { plan: "pro",        count: d.companies.byPlan.pro,        color: "var(--am)" },
          { plan: "enterprise", count: d.companies.byPlan.enterprise, color: "var(--violet)" },
        ].map(({ plan, count, color }) => (
          <div key={plan} className="card p-4">
            <div className="font-display font-bold text-[26px] leading-none mb-2" style={{ color }}>{count}</div>
            <PlanBadge plan={plan} />
          </div>
        ))}
      </div>

      {/* Recent Companies + Monthly Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        {/* Companies table */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--ln)" }}>
            <span className="font-display font-bold text-[14px] uppercase tracking-[0.08em]" style={{ color: "var(--t1)" }}>Recent Companies</span>
            <Link href="/companies" className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors" style={{ color: "var(--t3)" }}
              onMouseOver={e => (e.currentTarget.style.color = "var(--am)")}
              onMouseOut={e => (e.currentTarget.style.color = "var(--t3)")}>
              View all <ArrowUpRight size={11}/>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>{["Company","Plan","Projects","Users","Status","Since"].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
              <tbody>
                {(d.recentCompanies ?? []).map((c: any) => (
                  <tr key={c.id}>
                    <td className="table-cell">
                      <Link href={`/companies/${c.id}`} className="font-display font-bold text-[13px] uppercase tracking-[0.04em] transition-colors" style={{ color: "var(--t1)" }}
                        onMouseOver={e => (e.currentTarget.style.color = "var(--am)")}
                        onMouseOut={e => (e.currentTarget.style.color = "var(--t1)")}>
                        {c.name}
                      </Link>
                    </td>
                    <td className="table-cell"><PlanBadge plan={c.plan}/></td>
                    <td className="table-cell font-mono text-[12px]" style={{ color: "var(--t2)" }}>{c.projectCount}</td>
                    <td className="table-cell font-mono text-[12px]" style={{ color: "var(--t2)" }}>{c.userCount}</td>
                    <td className="table-cell"><CompanyStatusBadge status={c.status}/></td>
                    <td className="table-cell font-mono text-[11px]" style={{ color: "var(--t3)" }}>{formatDate(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly growth */}
        <div className="card p-5">
          <div className="font-display font-bold text-[14px] uppercase tracking-[0.08em] mb-4" style={{ color: "var(--t1)" }}>
            Monthly Growth
          </div>
          {(d.monthlyGrowth ?? []).length === 0 ? (
            <p className="font-mono text-[10.5px] uppercase tracking-widest text-center py-8" style={{ color: "var(--t3)" }}>No data yet</p>
          ) : (
            <div className="space-y-2">
              {(d.monthlyGrowth ?? []).map((m: any) => {
                const max = Math.max(...(d.monthlyGrowth ?? []).map((x: any) => x.newCompanies), 1);
                const pct = (m.newCompanies / max) * 100;
                return (
                  <div key={m.month}>
                    <div className="flex justify-between font-mono text-[10px] mb-1" style={{ color: "var(--t3)" }}>
                      <span>{m.month}</span>
                      <span style={{ color: "var(--am)" }}>{m.newCompanies} new</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--ln)" }}>
            <div className="font-display font-bold text-[14px] uppercase tracking-[0.08em] mb-3" style={{ color: "var(--t1)" }}>Status Split</div>
            {[
              { label: "Active",    val: d.companies.active,    color: "var(--ok)" },
              { label: "Trial",     val: d.companies.trial,     color: "var(--am)" },
              { label: "Suspended", val: d.companies.suspended, color: "var(--err)" },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex justify-between items-center mb-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--t3)" }}>{label}</span>
                <span className="font-display font-bold text-[16px]" style={{ color }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top companies by revenue */}
      {(d.topCompanies ?? []).length > 0 && (
        <div className="card">
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--ln)" }}>
            <span className="font-display font-bold text-[14px] uppercase tracking-[0.08em]" style={{ color: "var(--t1)" }}>
              Top Companies by Revenue
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>{["Company","Plan","Projects","Total Billed"].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
              <tbody>
                {(d.topCompanies ?? []).slice(0,8).map((c: any, i: number) => (
                  <tr key={c.companyId}>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] w-5 text-center" style={{ color: "var(--t3)" }}>{String(i+1).padStart(2,"0")}</span>
                        <Link href={`/companies/${c.companyId}`} className="font-display font-bold text-[13px] uppercase tracking-[0.04em]" style={{ color: "var(--t1)" }}>{c.name}</Link>
                      </div>
                    </td>
                    <td className="table-cell"><PlanBadge plan={c.plan}/></td>
                    <td className="table-cell font-mono text-[12px]" style={{ color: "var(--t2)" }}>{c.projectCount}</td>
                    <td className="table-cell font-display font-bold text-[15px]" style={{ color: "var(--ok)" }}>{formatCurrency(c.totalBilled)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
