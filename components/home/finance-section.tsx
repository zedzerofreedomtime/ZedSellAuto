import { CircleDollarSign, ShieldCheck, WalletCards } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const financeItems = [
  {
    icon: WalletCards,
    label: "ดาวน์เริ่มต้น",
    value: "5%"
  },
  {
    icon: CircleDollarSign,
    label: "ดอกเบี้ยเริ่ม",
    value: "2.79%"
  },
  {
    icon: ShieldCheck,
    label: "อนุมัติไวสุด",
    value: "2 ชม."
  }
];

export function FinanceSection() {
  return (
    <section className="bg-zinc-950 py-10 text-white lg:py-12" id="finance">
      <div className="container grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <Badge className="border-white/20 bg-white/10 text-white">
            Smart finance
          </Badge>
          <h2 className="text-3xl font-semibold leading-tight">
            เห็นยอดผ่อนก่อนคุยกับเซลส์
          </h2>
          <p className="max-w-xl leading-7 text-white/70">
            ระบบจัดไฟแนนซ์ช่วยประเมินค่างวด เงินดาวน์ และข้อเสนอจากหลายสถาบัน
            เพื่อให้ตัดสินใจได้มั่นใจกว่าเดิม
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {financeItems.map((item) => (
            <div
              className="rounded-lg border border-white/12 bg-white/[0.07] p-5"
              key={item.label}
            >
              <item.icon className="h-5 w-5 text-emerald-300" />
              <p className="mt-5 text-2xl font-semibold">{item.value}</p>
              <p className="mt-1 text-sm text-white/62">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
