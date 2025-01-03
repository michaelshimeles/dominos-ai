import Navbar from "@/components/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from "next";
import "./globals.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import { ThemeProvider } from "@/components/theme-provider";



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
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider dynamic>
        <body
          className={GeistSans.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <Analytics />
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
