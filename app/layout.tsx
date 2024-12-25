import Navbar from "@/components/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "AI Dominos Agent",
  description: "Order fresh pizza from Dominos",
  openGraph: {
    images: ["https://utfs.io/f/MD2AM9SEY8GucPis22p5qyE7FjNDKYduLOG2QHWh3f5RgSi0"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider dynamic>
        <body
          className={GeistSans.className}        >
          <Navbar />
          {children}
          <Analytics />
        </body>
      </ClerkProvider>
    </html>
  );
}
