"use client";

import { CalendarDays, HandCoins, MessageCircle } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStoredAccessToken } from "@/lib/auth-storage";
import { submitInquiry, submitOffer, submitTestDrive } from "@/lib/client-api";

type ListingActionPanelProps = {
  vehicleId?: string;
  vehicleName: string;
  vehiclePrice: number;
};

type Mode = "offer" | "testDrive" | "inquiry";

export function ListingActionPanel({
  vehicleId,
  vehicleName,
  vehiclePrice
}: ListingActionPanelProps) {
  const [mode, setMode] = useState<Mode>("offer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [offerAmount, setOfferAmount] = useState(String(vehiclePrice));
  const [preferredAt, setPreferredAt] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submitLabel() {
    switch (mode) {
      case "offer":
        return "ส่งข้อเสนอ";
      case "testDrive":
        return "นัดทดลองขับ";
      default:
        return "ส่งข้อความ";
    }
  }

  function resetAfterSubmit() {
    setStatus("ส่งข้อมูลเรียบร้อย ทีมงานจะติดต่อกลับเร็วที่สุด");
    setError("");
    setMessage("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!vehicleId) {
      setError("listing นี้ยังไม่เชื่อมกับ backend");
      setStatus("");
      return;
    }

    const token = getStoredAccessToken();

    startTransition(async () => {
      try {
        if (mode === "offer") {
          await submitOffer(token, {
            vehicleId,
            fullName,
            email,
            phone,
            offerAmountTHB: Number(offerAmount),
            note: message
          });
          resetAfterSubmit();
          return;
        }

        if (mode === "testDrive") {
          await submitTestDrive(token, {
            vehicleId,
            fullName,
            email,
            phone,
            preferredAt: new Date(preferredAt).toISOString(),
            note: message
          });
          resetAfterSubmit();
          return;
        }

        await submitInquiry(token, {
          vehicleId,
          fullName,
          email,
          phone,
          message,
          channel: "chat"
        });
        resetAfterSubmit();
      } catch (submissionError) {
        setStatus("");
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : `ไม่สามารถส่งข้อมูลสำหรับ ${vehicleName} ได้`
        );
      }
    });
  }

  return (
    <div className="mt-4 grid gap-3" id="lead-actions">
      <div className="grid gap-2 sm:grid-cols-3">
        <Button
          onClick={() => setMode("offer")}
          type="button"
          variant={mode === "offer" ? "premium" : "outline"}
        >
          <HandCoins />
          เสนอราคา
        </Button>
        <Button
          onClick={() => setMode("testDrive")}
          type="button"
          variant={mode === "testDrive" ? "premium" : "outline"}
        >
          <CalendarDays />
          นัดทดลองขับ
        </Button>
        <Button
          onClick={() => setMode("inquiry")}
          type="button"
          variant={mode === "inquiry" ? "premium" : "outline"}
        >
          <MessageCircle />
          แชทกับผู้ขาย
        </Button>
      </div>

      <form className="grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3" onSubmit={handleSubmit}>
        <Input onChange={(event) => setFullName(event.target.value)} placeholder="ชื่อ - นามสกุล" required value={fullName} />
        <Input onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required type="email" value={email} />
        <Input onChange={(event) => setPhone(event.target.value)} placeholder="เบอร์โทร" required value={phone} />

        {mode === "offer" ? (
          <Input
            min={1}
            onChange={(event) => setOfferAmount(event.target.value)}
            placeholder="จำนวนเงินที่ต้องการเสนอ"
            required
            type="number"
            value={offerAmount}
          />
        ) : null}

        {mode === "testDrive" ? (
          <Input
            onChange={(event) => setPreferredAt(event.target.value)}
            required
            type="datetime-local"
            value={preferredAt}
          />
        ) : null}

        <textarea
          className="min-h-24 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-950"
          onChange={(event) => setMessage(event.target.value)}
          placeholder={
            mode === "inquiry"
              ? "ฝากคำถามถึงผู้ขาย"
              : "หมายเหตุเพิ่มเติม (ถ้ามี)"
          }
          required={mode === "inquiry"}
          value={message}
        />

        <Button className="w-full" disabled={isPending} type="submit" variant="premium">
          {isPending ? "กำลังส่ง..." : submitLabel()}
        </Button>
      </form>

      {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}

