import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WaMate - Next Gen WhatsApp Automation",
  description: "Automate your customer communication with WaMate.",
  icons: {
    icon: '/favicon.ico',
  },
};
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
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-el-messiri",
  display: 'swap',
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
