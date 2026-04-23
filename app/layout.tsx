import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zed Auto - ตลาดรถมือสองพรีเมียม",
  description:
    "ซื้อขายรถมือสองคุณภาพ ตรวจสภาพแล้ว พร้อมไฟแนนซ์ บริการส่งมอบ และประสบการณ์ใช้งานที่เรียบง่าย"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
