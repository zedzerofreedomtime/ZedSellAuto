import { BadgeCheck } from "lucide-react";

const items = [
  "ไม่มีชนหนักหรือน้ำท่วม",
  "เอกสารครบ ตรวจประวัติได้",
  "รับประกันเครื่องและเกียร์",
  "ประเมินเทิร์นรถฟรี"
];

export function CertifiedStrip() {
  return (
    <section className="border-y border-zinc-200 bg-white" id="certified">
      <div className="container grid gap-4 py-5 md:grid-cols-4">
        {items.map((item) => (
          <div className="flex items-center gap-2 text-sm font-medium" key={item}>
            <BadgeCheck className="h-4 w-4 text-emerald-600" />
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
