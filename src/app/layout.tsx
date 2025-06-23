import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@app/assets/styles/globals.css";
import { Providers } from "./components/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BuilderSoft CMS",
  description: "Generated with Macbook M3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className={inter.className}>
        <Toaster position="bottom-right" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
