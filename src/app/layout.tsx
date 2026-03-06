import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// แก้ไขส่วนนี้เพื่อให้รองรับการเป็นแอปมือถือ (PWA)
export const metadata: Metadata = {
  title: "TaskMaster",
  description: "My Personal Task App",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TaskMaster",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}