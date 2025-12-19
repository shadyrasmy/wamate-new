import type { Metadata } from "next";
import { Outfit, El_Messiri } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { UIProvider, useUI } from "@/context/UIContext";
import HeaderScripts from "@/components/layout/HeaderScripts";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const elMessiri = El_Messiri({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-el-messiri",
});

import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <UIProvider>
        <html lang="en">
          <body
            suppressHydrationWarning={true}
            className={`${outfit.variable} ${elMessiri.variable} font-sans antialiased`}
          >
            <ClientLayoutWrapper>
              <HeaderScripts />
              {children}
            </ClientLayoutWrapper>
          </body>
        </html>
      </UIProvider>
    </AuthProvider>
  );
}
