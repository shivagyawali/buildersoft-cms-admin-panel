"use client";
export default function Page() {
  const name = "invoice-periods".replace("-"," ").replace(/\b\w/g,c=>c.toUpperCase());
  return (
    <div className="animate-fade-in relative z-10">
      <div className="page-sub mb-1.5">Section / {name}</div>
      <div className="hairline-strong mb-5 mt-1" />
      <h1 className="page-title">{name}</h1>
      <div className="card bp-grid mt-8 flex items-center justify-center py-24">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--t3)]">
          This section is under construction
        </p>
      </div>
    </div>
  );
}
