import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/ui/Providers";

export const metadata: Metadata = {
  title: "BuilderSoft CMS",
  description: "Multi-tenant Construction Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
