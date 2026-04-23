import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zed Auto - ตลาดรถมือสองพรีเมียม",
  description:
    "ซื้อขายรถมือสองคุณภาพ ตรวจสภาพแล้ว พร้อมไฟแนนซ์และบริการส่งมอบทั่วไทย"
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
