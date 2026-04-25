import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

type AuthShellProps = {
  alternateHref: string;
  alternateLabel: string;
  alternateText: string;
  audience?: "admin" | "any" | "user";
  description: string;
  eyebrow?: string;
  footerText: string;
  helperNote?: string;
  highlights?: string[];
  mode: "login" | "signup";
  passwordLabel: string;
  submitLabel: string;
  title: string;
};

const userHighlights = [
  "บันทึกรถที่สนใจและกลับมาเปรียบเทียบได้ภายหลัง",
  "ติดตามสถานะการจอง ทดลองขับ และไฟแนนซ์ในที่เดียว",
  "รับข้อเสนอพิเศษสำหรับรถที่คุณสนใจ"
];

export function AuthShell({
  alternateHref,
  alternateLabel,
  alternateText,
  audience = "any",
  description,
  eyebrow = "Account",
  footerText,
  helperNote,
  highlights = userHighlights,
  mode,
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
            <Badge variant="success">{eyebrow}</Badge>
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
            <AuthForm
              audience={audience}
              mode={mode}
              passwordLabel={passwordLabel}
              submitLabel={submitLabel}
            />

            {helperNote ? (
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
                {helperNote}
              </div>
            ) : null}

            <p className="pt-2 text-center text-sm text-zinc-600">
              {alternateText}{" "}
              <Link
                className="font-semibold text-emerald-700 hover:text-emerald-800"
                href={alternateHref}
              >
                {alternateLabel}
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
