import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "WaMate - All WhatsApp in One Place",
  description: "The ultimate WhatsApp CRM for high-performance teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${outfit.variable} font-sans antialiased bg-[#0d0a1a] text-white`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
