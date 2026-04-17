"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 select-none"
      style={{
        background: "var(--bg-sunken)",
        border: "1px solid var(--border-default)",
        color: "var(--text-secondary)",
      }}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark
        ? <><Sun size={13} style={{ color: "var(--brand-400)" }} /><span>Light</span></>
        : <><Moon size={13} style={{ color: "var(--brand-500)" }} /><span>Dark</span></>
      }
    </button>
  );
}
