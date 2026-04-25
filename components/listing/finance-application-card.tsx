"use client";

import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildApiUrl } from "@/lib/api-config";
import { getStoredAccessToken } from "@/lib/auth-storage";
import { formatMonthlyPaymentTHB } from "@/lib/formatters";

type FinanceApplicationCardProps = {
  monthlyPaymentTHB: number;
  priceTHB: number;
  vehicleId: string;
};

export function FinanceApplicationCard({
  monthlyPaymentTHB,
  priceTHB,
  vehicleId
}: FinanceApplicationCardProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [downPaymentPercent, setDownPaymentPercent] = useState("20");
  const [loanTermMonths, setLoanTermMonths] = useState("72");
  const [creditBand, setCreditBand] = useState("good");
  const [monthlyIncomeTHB, setMonthlyIncomeTHB] = useState("50000");
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estimate = useMemo(() => {
    const down = Number(downPaymentPercent || 0);
    const term = Number(loanTermMonths || 72);
    const principal = priceTHB * (1 - down / 100);

    return term > 0 ? Math.round(principal / term) : monthlyPaymentTHB;
  }, [downPaymentPercent, loanTermMonths, monthlyPaymentTHB, priceTHB]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setStatusMessage("");

    const token = getStoredAccessToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(buildApiUrl("/leads/finance"), {
        method: "POST",
        headers,
        body: JSON.stringify({
          vehicleId,
          fullName,
          email,
          phone,
          downPaymentPercent: Number(downPaymentPercent),
          loanTermMonths: Number(loanTermMonths),
          creditBand,
          monthlyIncomeTHB: Number(monthlyIncomeTHB)
        })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        throw new Error(payload?.error || "ส่งคำขอไฟแนนซ์ไม่สำเร็จ");
      }

      setStatusMessage("ส่งคำขอไฟแนนซ์เรียบร้อยแล้ว");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการส่งคำขอ"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.5fr_1fr]">
      <div>
        <p className="text-sm text-muted-foreground">ค่างวดประมาณ</p>
        <p className="mt-2 text-4xl font-semibold">{formatMonthlyPaymentTHB(estimate)}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          คำนวณจากราคาและเปอร์เซ็นต์ดาวน์ที่คุณระบุ
        </p>
      </div>
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <Input onChange={(event) => setFullName(event.target.value)} placeholder="ชื่อ - นามสกุล" value={fullName} />
        <Input onChange={(event) => setEmail(event.target.value)} placeholder="อีเมล" type="email" value={email} />
        <Input onChange={(event) => setPhone(event.target.value)} placeholder="เบอร์โทรศัพท์" value={phone} />
        <Input min="0" onChange={(event) => setDownPaymentPercent(event.target.value)} placeholder="เงินดาวน์ (%)" type="number" value={downPaymentPercent} />
        <Input min="12" onChange={(event) => setLoanTermMonths(event.target.value)} placeholder="ระยะเวลาผ่อน (เดือน)" type="number" value={loanTermMonths} />
        <Input onChange={(event) => setCreditBand(event.target.value)} placeholder="ระดับเครดิต เช่น good" value={creditBand} />
        <Input min="0" onChange={(event) => setMonthlyIncomeTHB(event.target.value)} placeholder="รายได้ต่อเดือน (บาท)" type="number" value={monthlyIncomeTHB} />

        {errorMessage ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {statusMessage ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {statusMessage}
          </p>
        ) : null}

        <Button className="mt-2 w-full sm:w-fit" disabled={isSubmitting} type="submit" variant="premium">
          {isSubmitting ? "กำลังส่ง..." : "ยื่นขอไฟแนนซ์"}
        </Button>
      </form>
    </div>
  );
}
