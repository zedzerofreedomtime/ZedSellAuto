import { SiteHeader } from "@/components/layout/site-header";
import { SellCarForm } from "@/components/sell/sell-car-form";
import { Badge } from "@/components/ui/badge";

export default function SellPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf8f3_0%,#f8fafc_45%,#ffffff_100%)]">
      <SiteHeader backHref="/" backLabel="กลับหน้าแรก" />

      <section className="container py-8 lg:py-12">
        <div className="max-w-4xl">
          <Badge variant="success">Sell your car</Badge>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl">
            ลงขายรถกับ Zed Auto
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg">
            กรอกรายละเอียดรถ รูปภาพ และข้อมูลติดต่อให้ครบ ทีมงานจะใช้ข้อมูลนี้เพื่อช่วยคัดกรองประกาศและประเมินความพร้อมก่อนเผยแพร่
          </p>
        </div>
      </section>

      <SellCarForm />
    </main>
  );
}
