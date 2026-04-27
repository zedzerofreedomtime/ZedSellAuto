import { SiteHeader } from "@/components/layout/site-header";
import { ValuationWorkspace } from "@/components/sell/valuation-workspace";
import { Badge } from "@/components/ui/badge";

export default function SellValuationPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf8f3_0%,#f8fafc_45%,#ffffff_100%)]">
      <SiteHeader backHref="/sell" backLabel="กลับหน้าขายรถ" />

      <section className="container py-8 lg:py-12">
        <div className="max-w-4xl">
          <Badge variant="success">Preliminary valuation</Badge>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl">
            ประเมินราคารถเบื้องต้นก่อนลงขาย
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg">
            กรอกรายละเอียดรถให้ครบ ระบบจะส่งข้อมูลไปหาแอดมินเป็นช่องแชต และเมื่อแอดมินตรวจราคาแล้วจะแจ้งราคาตลาด ราคาที่ศูนย์รถมือสองรับซื้อ และราคาที่ควรตั้งขายกลับมาในแชตนี้
          </p>
        </div>
      </section>

      <ValuationWorkspace />
    </main>
  );
}
