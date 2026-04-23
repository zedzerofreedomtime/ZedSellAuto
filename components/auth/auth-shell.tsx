import Link from "next/link";

import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AuthShellProps = {
  alternateHref: string;
  alternateLabel: string;
  alternateText: string;
  description: string;
  footerText: string;
  passwordLabel: string;
  submitLabel: string;
  title: string;
};

const highlights = [
  "บันทึกรถที่สนใจและเปรียบเทียบได้ภายหลัง",
  "ติดตามสถานะการจอง ทดลองขับ และไฟแนนซ์ในที่เดียว",
  "รับข้อเสนอพิเศษสำหรับรถที่คุณสนใจ"
];

export function AuthShell({
  alternateHref,
  alternateLabel,
  alternateText,
  description,
  footerText,
  passwordLabel,
  submitLabel,
  title
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf8f3_0%,#f7f8fa_48%,#ffffff_100%)]">
      <SiteHeader backHref="/" backLabel="กลับหน้าแรก" />

      <section className="container grid gap-8 py-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.82fr)] lg:py-12">
        <div className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-6 shadow-line sm:p-8">
          <div>
            <Badge variant="success">Account</Badge>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              {description}
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {highlights.map((item) => (
              <div
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{footerText}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700" htmlFor="email">
                อีเมล
              </label>
              <Input id="email" placeholder="you@example.com" type="email" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-zinc-700" htmlFor="password">
                  {passwordLabel}
                </label>
                <Link className="text-sm font-medium text-emerald-700 hover:text-emerald-800" href="#">
                  ลืมรหัสผ่าน?
                </Link>
              </div>
              <Input id="password" placeholder="อย่างน้อย 8 ตัวอักษร" type="password" />
            </div>

            <label className="flex items-center gap-3 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700">
              <input className="h-4 w-4 accent-emerald-600" type="checkbox" />
              จดจำการเข้าสู่ระบบบนอุปกรณ์นี้
            </label>

            <Button className="h-12 w-full text-base" variant="premium">
              {submitLabel}
            </Button>

            <div className="grid gap-3">
              <Button className="w-full" variant="outline">
                เข้าสู่ระบบด้วย Google
              </Button>
            </div>

            <p className="pt-2 text-center text-sm text-zinc-600">
              {alternateText}{" "}
              <Link className="font-semibold text-emerald-700 hover:text-emerald-800" href={alternateHref}>
                {alternateLabel}
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
