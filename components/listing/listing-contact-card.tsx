"use client";

import { CalendarDays, HandCoins, MessageCircle } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildApiUrl } from "@/lib/api-config";
import { getStoredAccessToken } from "@/lib/auth-storage";

type ListingContactCardProps = {
  vehicleId: string;
};

type ContactMode = "offer" | "test-drive" | "inquiry";

export function ListingContactCard({
  vehicleId
}: ListingContactCardProps) {
  const [mode, setMode] = useState<ContactMode>("offer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [offerAmountTHB, setOfferAmountTHB] = useState("");
  const [preferredAt, setPreferredAt] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");
    setErrorMessage("");

    const token = getStoredAccessToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let path = "/leads/offers";
    let body: Record<string, unknown> = {
      vehicleId,
      fullName,
      email,
      phone
    };

    if (mode === "offer") {
      path = "/leads/offers";
      body = {
        ...body,
        offerAmountTHB: Number(offerAmountTHB),
        note
      };
    }

    if (mode === "test-drive") {
      path = "/leads/test-drives";
      body = {
        ...body,
        preferredAt: new Date(preferredAt).toISOString(),
        note
      };
    }

    if (mode === "inquiry") {
      path = "/leads/inquiries";
      body = {
        ...body,
        message,
        channel: "web"
      };
    }

    try {
      const response = await fetch(buildApiUrl(path), {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        throw new Error(payload?.error || "ส่งข้อมูลไม่สำเร็จ");
      }

      setStatusMessage("ส่งข้อมูลถึงทีมขายเรียบร้อยแล้ว");
      setOfferAmountTHB("");
      setPreferredAt("");
      setNote("");
      setMessage("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการส่งข้อมูล"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-line">
      <p className="text-sm font-semibold text-zinc-950">สนใจรถคันนี้</p>
      <p className="mt-1 text-sm text-muted-foreground">
        นัดทดลองขับ ส่งข้อเสนอ หรือฝากคำถามถึงทีมขายได้ทันที
      </p>

      <div className="mt-4 grid gap-2">
        <Button onClick={() => setMode("offer")} variant={mode === "offer" ? "premium" : "outline"}>
          <HandCoins />
          เสนอราคา
        </Button>
        <Button onClick={() => setMode("test-drive")} variant={mode === "test-drive" ? "premium" : "outline"}>
          <CalendarDays />
          นัดทดลองขับ
        </Button>
        <Button onClick={() => setMode("inquiry")} variant={mode === "inquiry" ? "premium" : "outline"}>
          <MessageCircle />
          แชทกับผู้ขาย
        </Button>
      </div>

      <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
        <Input onChange={(event) => setFullName(event.target.value)} placeholder="ชื่อ - นามสกุล" value={fullName} />
        <Input onChange={(event) => setEmail(event.target.value)} placeholder="อีเมล" type="email" value={email} />
        <Input onChange={(event) => setPhone(event.target.value)} placeholder="เบอร์โทรศัพท์" value={phone} />

        {mode === "offer" ? (
          <>
            <Input
              min="0"
              onChange={(event) => setOfferAmountTHB(event.target.value)}
              placeholder="วงเงินที่ต้องการเสนอ (บาท)"
              type="number"
              value={offerAmountTHB}
            />
            <Input onChange={(event) => setNote(event.target.value)} placeholder="หมายเหตุเพิ่มเติม" value={note} />
          </>
        ) : null}

        {mode === "test-drive" ? (
          <>
            <Input
              onChange={(event) => setPreferredAt(event.target.value)}
              type="datetime-local"
              value={preferredAt}
            />
            <Input onChange={(event) => setNote(event.target.value)} placeholder="ช่วงเวลาที่สะดวกหรือหมายเหตุ" value={note} />
          </>
        ) : null}

        {mode === "inquiry" ? (
          <textarea
            className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            onChange={(event) => setMessage(event.target.value)}
            placeholder="ฝากข้อความถึงผู้ขาย"
            value={message}
          />
        ) : null}

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

        <Button disabled={isSubmitting} type="submit" variant="accent">
          {isSubmitting ? "กำลังส่ง..." : "ยืนยันส่งข้อมูล"}
        </Button>
      </form>
    </div>
  );
}
