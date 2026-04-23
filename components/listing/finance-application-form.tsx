"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStoredAccessToken } from "@/lib/auth-storage";
import { submitFinanceApplication } from "@/lib/client-api";

type FinanceApplicationFormProps = {
  monthlyLabel: string;
  vehicleId?: string;
  vehiclePrice: number;
};

export function FinanceApplicationForm({
  monthlyLabel,
  vehicleId,
  vehiclePrice
}: FinanceApplicationFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [downPaymentPercent, setDownPaymentPercent] = useState("20");
  const [loanTermMonths, setLoanTermMonths] = useState("72");
  const [creditBand, setCreditBand] = useState("เครดิตดี");
  const [monthlyIncomeTHB, setMonthlyIncomeTHB] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!vehicleId) {
      setError("รายการนี้ยังไม่เชื่อมกับ backend");
      setStatus("");
      return;
    }

    const token = getStoredAccessToken();

    startTransition(async () => {
      try {
        await submitFinanceApplication(token, {
          vehicleId,
          fullName,
          email,
          phone,
          downPaymentPercent: Number(downPaymentPercent),
          loanTermMonths: Number(loanTermMonths),
          creditBand,
          monthlyIncomeTHB: Number(monthlyIncomeTHB)
        });
        setError("");
        setStatus("ส่งคำขอไฟแนนซ์เรียบร้อย ทีมงานจะประเมินและติดต่อกลับ");
      } catch (submissionError) {
        setStatus("");
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "ไม่สามารถส่งคำขอไฟแนนซ์ได้"
        );
      }
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.5fr_1fr]" id="finance-application">
      <div>
        <p className="text-sm text-muted-foreground">ค่างวดประมาณ</p>
        <p className="mt-2 text-4xl font-semibold">{monthlyLabel}</p>
        <p className="mt-1 text-sm text-muted-foreground">ประเมินจากราคารถ {vehiclePrice.toLocaleString("th-TH")} บาท</p>
      </div>

      <form className="grid gap-3" onSubmit={handleSubmit}>
        <Input onChange={(event) => setFullName(event.target.value)} placeholder="ชื่อ - นามสกุล" required value={fullName} />
        <Input onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required type="email" value={email} />
        <Input onChange={(event) => setPhone(event.target.value)} placeholder="เบอร์โทร" required value={phone} />
        <Input min={0} onChange={(event) => setMonthlyIncomeTHB(event.target.value)} placeholder="รายได้ต่อเดือน (บาท)" required type="number" value={monthlyIncomeTHB} />
        <Input min={0} max={100} onChange={(event) => setDownPaymentPercent(event.target.value)} placeholder="เงินดาวน์ (%)" required type="number" value={downPaymentPercent} />
        <Input min={12} onChange={(event) => setLoanTermMonths(event.target.value)} placeholder="ระยะเวลาผ่อน (เดือน)" required type="number" value={loanTermMonths} />
        <Input onChange={(event) => setCreditBand(event.target.value)} placeholder="เครดิต เช่น เครดิตดี" required value={creditBand} />

        <Button className="mt-2 w-full sm:w-fit" disabled={isPending} type="submit" variant="premium">
          {isPending ? "กำลังส่ง..." : "ยื่นขอไฟแนนซ์"}
        </Button>

        {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </form>
    </div>
  );
}
