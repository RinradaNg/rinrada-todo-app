import type { Metadata, Viewport } from "next"; // เพิ่ม Viewport เข้ามาครับ
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

// 1. ตั้งค่า Viewport เพื่อให้แอปไม่เด้งไปมาและดูเต็มจอ
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// 2. แก้ไข Metadata เพื่อลบแถบดำด้านบน
export const metadata: Metadata = {
  title: "TaskMaster",
  description: "Vanness Plus Edition",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // ทำให้แถบสถานะโปร่งใสและเนื้อหาดันขึ้นไปสุด
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