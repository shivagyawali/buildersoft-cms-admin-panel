"use client";
import { useQuery } from "@tanstack/react-query";
import { superadminApi } from "@/lib/api";
import { PageHeader, Spinner } from "@/components/ui/UI";
import { getInitials, formatDate, extractArray } from "@/lib/utils";
import { User } from "@/types";
import { Users } from "lucide-react";

const RC:Record<string,{bg:string;color:string}>={superadmin:{bg:"var(--purple-bg)",color:"var(--purple)"},admin:{bg:"var(--err-bg)",color:"var(--err)"},manager:{bg:"var(--acc-subtle)",color:"var(--acc)"},supervisor:{bg:"var(--info-bg)",color:"var(--info)"},worker:{bg:"var(--ok-bg)",color:"var(--ok)"},contractor:{bg:"var(--muted-bg)",color:"var(--muted)"}};

export default function SuperAdminUsersPage() {
  const {data,isLoading}=useQuery({queryKey:["all-users"],queryFn:()=>superadminApi.listUsers({limit:200})});
  const users:User[]=extractArray<User>(data);
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="All Users" subtitle={`${users.length} across the platform`} icon={<Users size={22}/>}/>
      <div className="card overflow-hidden">
        {isLoading?<div className="flex justify-center py-16"><Spinner size="lg"/></div>:(
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>{["User","Email","Role","Company","Joined"].map(h=><th key={h} className="tbl-head">{h}</th>)}</tr></thead>
              <tbody>
                {users.map(u=>{const rc=RC[u.role]??RC.contractor;return(
                  <tr key={u.id}>
                    <td className="tbl-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-mono text-[11px] font-bold" style={{background:rc.bg,color:rc.color,border:`1.5px solid ${rc.color}30`}}>{getInitials(u.firstName,u.lastName)}</div>
                        <span className="font-semibold text-[14px]" style={{color:"var(--tx)"}}>{u.firstName} {u.lastName}</span>
                      </div>
                    </td>
                    <td className="tbl-cell text-[13px]" style={{color:"var(--tx-2)"}}>{u.email}</td>
                    <td className="tbl-cell"><span className="badge" style={{background:rc.bg,color:rc.color}}>{u.role}</span></td>
                    <td className="tbl-cell text-[13px]" style={{color:"var(--tx-2)"}}>{(u as any).companyRef?.name??((u as any).companyId?((u as any).companyId as string).slice(0,8)+"…":"—")}</td>
                    <td className="tbl-cell font-mono text-[12px]" style={{color:"var(--tx-3)"}}>{formatDate((u as any).createdAt??"")}</td>
                  </tr>
                );})}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
