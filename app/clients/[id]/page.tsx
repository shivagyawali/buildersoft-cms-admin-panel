"use client";
import { useQuery } from "@tanstack/react-query";
import { clientsApi } from "@/lib/api";
import { PageHeader, Spinner, StatCard } from "@/components/ui/UI";
import { ArrowLeft, Mail, Phone, Building2, MapPin, FileText, FolderKanban } from "lucide-react";
import { formatDate, formatCurrency, getInitials, getStatusColor, capitalize } from "@/lib/utils";
import Link from "next/link";
import clsx from "clsx";

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useQuery({
    queryKey: ["client", params.id],
    queryFn: () => clientsApi.get(params.id),
  });
  const { data: statsData } = useQuery({
    queryKey: ["client-stats", params.id],
    queryFn: () => clientsApi.getStats(params.id),
  });

  const client = data?.data?.data ?? data?.data;
  const stats = statsData?.data?.data ?? statsData?.data;

  if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
  if (!client) return <div className="text-stone-400 text-center py-24">Client not found</div>;

  return (
    <div className="animate-fade-in">
      <Link href="/clients" className="btn btn-ghost mb-6 -ml-2 text-stone-500">
        <ArrowLeft size={16} /> Back to Clients
      </Link>

      <PageHeader
        title={`${client.firstName} ${client.lastName}`}
        subtitle={client.company ?? "Individual Client"}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="card p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-xl font-semibold text-amber-700 mb-3">
              {getInitials(client.firstName, client.lastName)}
            </div>
            <h2 className="font-semibold text-stone-900">{client.firstName} {client.lastName}</h2>
            {client.company && <p className="text-sm text-stone-400">{client.company}</p>}
            <span className={clsx("badge mt-2", client.isActive ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-400")}>
              {client.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2.5 text-stone-600">
              <Mail size={14} className="text-stone-400 flex-shrink-0" />
              <span className="truncate">{client.email}</span>
            </div>
            {client.phone && (
              <div className="flex items-center gap-2.5 text-stone-600">
                <Phone size={14} className="text-stone-400 flex-shrink-0" />{client.phone}
              </div>
            )}
            {client.company && (
              <div className="flex items-center gap-2.5 text-stone-600">
                <Building2 size={14} className="text-stone-400 flex-shrink-0" />{client.company}
              </div>
            )}
            {(client.city || client.address) && (
              <div className="flex items-start gap-2.5 text-stone-600">
                <MapPin size={14} className="text-stone-400 flex-shrink-0 mt-0.5" />
                <span>{[client.address, client.city, client.province, client.postalCode].filter(Boolean).join(", ")}</span>
              </div>
            )}
          </div>

          {client.notes && (
            <div className="mt-5 pt-5 border-t border-stone-100">
              <p className="text-xs text-stone-400 uppercase tracking-wide mb-1.5">Notes</p>
              <p className="text-sm text-stone-600">{client.notes}</p>
            </div>
          )}

          <p className="text-xs text-stone-400 mt-5 pt-5 border-t border-stone-100">
            Client since {formatDate(client.createdAt)}
          </p>
        </div>

        {/* Stats & projects */}
        <div className="lg:col-span-2 space-y-6">
          {stats && (
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Projects" value={stats.totalProjects ?? 0} icon={<FolderKanban size={16} />} />
              <StatCard label="Invoices" value={stats.totalInvoices ?? 0} icon={<FileText size={16} />} />
              <StatCard label="Total Billed" value={formatCurrency(stats.totalBilled ?? 0)} icon={<FileText size={16} />} />
            </div>
          )}

          {stats?.recentprojects && stats?.recentprojects?.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-100 font-semibold text-stone-800">Projects</div>
              <div className="divide-y divide-stone-50">
                {stats.recentprojects && stats?.recentprojects?.map((p: { id: string; name: string; status: string; expectedEndDate?: string }) => (
                  <Link key={p.id} href={`/projects/${p.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-stone-50 transition-colors">
                    <span className="text-sm font-medium text-stone-700">{p.name}</span>
                    <div className="flex items-center gap-3">
                      {p.expectedEndDate && <span className="text-xs text-stone-400">{formatDate(p.expectedEndDate)}</span>}
                      <span className={clsx("badge", getStatusColor(p.status))}>{capitalize(p.status)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
