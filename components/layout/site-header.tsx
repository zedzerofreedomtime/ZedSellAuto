"use client";

import { ArrowLeft, Car, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  backHref?: string;
  backLabel?: string;
};

const menuItems = [
  { href: "/sell", label: "ขายรถ" },
  { href: "/cars/all", label: "ซื้อรถ" },
  { href: "/#finance", label: "ไฟแนนซ์" }
];

const resourceItems = [
  {
    href: "/how-it-works",
    label: "วิธีใช้งาน",
    description: "ดูขั้นตอนซื้อ ขาย และส่งมอบรถแบบครบลำดับ"
  },
  {
    href: "/pricing",
    label: "ราคาและบริการ",
    description: "ค่าธรรมเนียม แพ็กเกจ และบริการเสริมทั้งหมด"
  },
  {
    href: "/blog",
    label: "บทความ",
    description: "คู่มือซื้อรถและอัปเดตจากทีม Zed Auto"
  }
];

export function SiteHeader({ backHref, backLabel }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [desktopResourcesOpen, setDesktopResourcesOpen] = useState(false);

  function closeMenu() {
    setMobileResourcesOpen(false);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!desktopResourcesOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDesktopResourcesOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [desktopResourcesOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/90 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-5">
          <Link className="flex shrink-0 items-center gap-3" href="/">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold leading-5">Zed Auto</p>
              <p className="text-xs text-muted-foreground">Premium Used Cars</p>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {menuItems.map((item) => (
              <Link
                className="rounded-md px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}

            <div className="relative">
              <button
                aria-expanded={desktopResourcesOpen}
                className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
                onClick={() => setDesktopResourcesOpen((current) => !current)}
                type="button"
              >
                ศูนย์ข้อมูล
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    desktopResourcesOpen && "rotate-180"
                  )}
                />
              </button>

              {desktopResourcesOpen ? (
                <div className="absolute left-1/2 top-full mt-3 w-[320px] -translate-x-1/2 rounded-lg border border-zinc-200 bg-white p-2 shadow-soft">
                  {resourceItems.map((item) => (
                    <Link
                      className="block rounded-md px-3 py-3 transition hover:bg-zinc-50"
                      href={item.href}
                      key={item.href}
                      onClick={() => setDesktopResourcesOpen(false)}
                    >
                      <p className="text-sm font-semibold text-zinc-950">{item.label}</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            {backHref ? (
              <Button asChild variant="outline">
                <Link href={backHref}>
                  <ArrowLeft />
                  {backLabel ?? "กลับ"}
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link href="/login">เข้าสู่ระบบ</Link>
            </Button>
            <Button asChild variant="accent">
              <Link href="/signup">สมัครสมาชิก</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {backHref ? (
              <Button asChild variant="outline">
                <Link href={backHref}>
                  <ArrowLeft />
                  {backLabel ?? "กลับ"}
                </Link>
              </Button>
            ) : null}
            <Button
              aria-expanded={menuOpen}
              aria-label="เปิดเมนู"
              onClick={() => setMenuOpen(true)}
              size="icon"
              variant="ghost"
            >
              <Menu />
            </Button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-zinc-950/45 transition-opacity lg:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeMenu}
      />

      <aside
        className={cn(
          "fixed right-0 top-0 z-[60] flex h-screen w-full max-w-[400px] translate-x-full flex-col bg-white shadow-2xl transition-transform duration-300 lg:hidden",
          menuOpen && "translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
          <div>
            <p className="text-sm text-muted-foreground">Menu</p>
            <p className="text-2xl font-semibold">สำรวจ Zed Auto</p>
          </div>
          <Button
            aria-label="ปิดเมนู"
            onClick={closeMenu}
            size="icon"
            variant="ghost"
          >
            <X />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <nav className="grid">
            {menuItems.map((item) => (
              <Link
                className="border-b border-zinc-200 py-5 text-2xl font-semibold tracking-normal text-zinc-950 transition hover:text-emerald-700"
                href={item.href}
                key={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}

            <div className="border-b border-zinc-200 py-2">
              <button
                aria-expanded={mobileResourcesOpen}
                className="flex w-full items-center justify-between py-3 text-left text-2xl font-semibold tracking-normal text-zinc-950 transition hover:text-emerald-700"
                onClick={() => setMobileResourcesOpen((current) => !current)}
                type="button"
              >
                ศูนย์ข้อมูล
                <ChevronDown
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    mobileResourcesOpen && "rotate-180"
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid overflow-hidden transition-[grid-template-rows] duration-200",
                  mobileResourcesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className="pb-3">
                    {resourceItems.map((item) => (
                      <Link
                        className="block rounded-lg px-4 py-3 transition hover:bg-zinc-50"
                        href={item.href}
                        key={item.href}
                        onClick={closeMenu}
                      >
                        <p className="text-base font-semibold text-zinc-950">{item.label}</p>
                        <p className="mt-1 text-sm leading-6 text-zinc-500">
                          {item.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div className="mt-8 grid gap-3">
            <Button asChild className="h-12 text-base" variant="outline">
              <Link href="/login" onClick={closeMenu}>
                เข้าสู่ระบบ
              </Link>
            </Button>
            <Button asChild className="h-12 text-base" variant="accent">
              <Link href="/signup" onClick={closeMenu}>
                สมัครสมาชิก
              </Link>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
