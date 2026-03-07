import type { Metadata, Viewport } from "next";
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

// 1. เพิ่ม viewportFit: "cover" เพื่อให้แอปขยายเต็มพื้นที่จอ iPhone
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // บรรทัดนี้สำคัญที่สุดในการแก้ปัญหาแถบดำครับ
};

export const metadata: Metadata = {
  title: "TaskMaster",
  description: "Vanness Plus Edition",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // ทำให้แถบสถานะโปร่งใส
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