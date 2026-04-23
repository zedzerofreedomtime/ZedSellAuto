import { ArrowLeft, Bell, Car, Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type SiteHeaderProps = {
  backHref?: string;
  backLabel?: string;
};

export function SiteHeader({ backHref, backLabel }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/86 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link className="flex items-center gap-3" href="/">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950 text-white">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-bold leading-5">Zed Auto</p>
            <p className="text-xs text-muted-foreground">Premium Used Cars</p>
          </div>
        </Link>

        {backHref ? (
          <Button variant="outline" asChild>
            <Link href={backHref}>
              <ArrowLeft />
              {backLabel ?? "กลับ"}
            </Link>
          </Button>
        ) : (
          <>
            <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-600 md:flex">
              <Link className="text-zinc-950" href="/cars/all">
                รถทั้งหมด
              </Link>
              <Link href="/cars/all">ประเภทรถ</Link>
              <a href="#finance">ไฟแนนซ์</a>
              <a href="#sell">ขายรถ</a>
            </nav>
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="icon" aria-label="แจ้งเตือน">
                <Bell />
              </Button>
              <Button variant="outline">ลงขายรถ</Button>
              <Button variant="premium" asChild>
                <Link href="/cars/all">ค้นหารถ</Link>
              </Button>
            </div>
            <Button className="md:hidden" variant="ghost" size="icon" aria-label="เมนู">
              <Menu />
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
