"use client";
import { useQuery } from "@tanstack/react-query";
import { superadminApi } from "@/lib/api";
import { PageHeader, Spinner } from "@/components/ui/UI";
import { getInitials, formatDate, capitalize, extractArray } from "@/lib/utils";
import { User } from "@/types";

const ROLE_COLORS: Record<string,{bg:string;color:string}> = {
  superadmin: {bg:"var(--violet-bg)",color:"var(--violet)"},
  admin:      {bg:"var(--err-bg)",color:"var(--err)"},
  manager:    {bg:"var(--am3)",color:"var(--am)"},
  supervisor: {bg:"var(--info-bg)",color:"var(--bl)"},
  worker:     {bg:"var(--ok-bg)",color:"var(--ok)"},
  contractor: {bg:"var(--muted-bg)",color:"var(--muted)"},
};

export default function SuperAdminUsersPage() {
  const { data, isLoading } = useQuery({ queryKey: ["all-users"], queryFn: () => superadminApi.listUsers({ limit: 200 }) });
  const users: User[] = extractArray<User>(data);

  return (
    <div className="animate-fade-in relative z-10">
      <PageHeader title="All Users" subtitle={`${users.length} across platform`}/>
      <div className="card overflow-hidden">
        {isLoading ? <div className="flex justify-center py-16"><Spinner/></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>{["User","Email","Role","Company","Joined"].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
              <tbody>
                {users.map(u => {
                  const rc = ROLE_COLORS[u.role] ?? ROLE_COLORS.contractor;
                  return (
                    <tr key={u.id}>
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center font-mono text-[11px] font-semibold" style={{background:rc.bg,color:rc.color,borderRadius:2}}>{getInitials(u.firstName,u.lastName)}</div>
                          <span className="font-semibold text-[14px]" style={{color:"var(--t1)"}}>{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td className="table-cell text-[13px]" style={{color:"var(--t2)"}}>{u.email}</td>
                      <td className="table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]" style={{background:rc.bg,color:rc.color,borderRadius:2}}>{u.role}</span>
                      </td>
                      <td className="table-cell text-[12.5px]" style={{color:"var(--t2)"}}>{(u as any).companyRef?.name ?? (u.companyId ? u.companyId.slice(0,8)+"…" : "—")}</td>
                      <td className="table-cell font-mono text-[11px]" style={{color:"var(--t3)"}}>{formatDate(u.createdAt ?? "")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
