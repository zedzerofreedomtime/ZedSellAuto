"use client";

import { MessageCircle, Send, Sparkles } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";

import { MessageList } from "@/components/sell/valuation-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  addAdminValuationMessage,
  buildVehicleTitle,
  formatTHB,
  getServerValuationSnapshot,
  getValuationSnapshot,
  parseValuationSnapshot,
  sendAdminValuationAssessment,
  subscribeToValuationRequests,
  type ValuationAssessment,
  type ValuationRequest
} from "@/lib/valuation-storage";
import { cn } from "@/lib/utils";

type AssessmentDraft = Omit<ValuationAssessment, "estimatedAt">;

export function ValuationAdminPanel() {
  const snapshot = useSyncExternalStore(
    subscribeToValuationRequests,
    getValuationSnapshot,
    getServerValuationSnapshot
  );
  const requests = useMemo(() => parseValuationSnapshot(snapshot), [snapshot]);
  const [selectedId, setSelectedId] = useState("");
  const [drafts, setDrafts] = useState<Record<string, AssessmentDraft>>({});
  const [adminMessage, setAdminMessage] = useState("");
  const selectedRequest =
    requests.find((request) => request.id === selectedId) ?? requests[0] ?? null;
  const pendingCount = requests.filter((request) => request.status === "pending" && !request.listing).length;
  const assessedCount = requests.filter((request) => request.status === "assessed").length;
  const listedCount = requests.filter((request) => request.listing).length;
  const draft = selectedRequest ? getDraft(selectedRequest, drafts) : null;

  function updateDraft(key: keyof AssessmentDraft, value: string) {
    if (!selectedRequest) {
      return;
    }

    setDrafts((current) => ({
      ...current,
      [selectedRequest.id]: {
        ...getDraft(selectedRequest, current),
        [key]: key === "note" ? value : parsePrice(value)
      }
    }));
  }

  function handleSendAssessment() {
    if (!selectedRequest || !draft) {
      return;
    }

    sendAdminValuationAssessment(selectedRequest.id, draft);
  }

  function handleSendMessage() {
    if (!selectedRequest || !adminMessage.trim()) {
      return;
    }

    addAdminValuationMessage(selectedRequest.id, adminMessage.trim());
    setAdminMessage("");
  }

  return (
    <section className="mt-8">
      <div className="mb-4 grid gap-4 md:grid-cols-4">
        <SummaryCard label="คำขอทั้งหมด" value={`${requests.length}`} />
        <SummaryCard label="รอประเมิน" value={`${pendingCount}`} />
        <SummaryCard label="แจ้งราคาแล้ว" value={`${assessedCount}`} />
        <SummaryCard label="ลูกค้าลงประกาศแล้ว" value={`${listedCount}`} />
      </div>

      <Card className="bg-white">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge variant="success">Valuation chat</Badge>
              <CardTitle className="mt-3 text-2xl">แชตประเมินราคารถจากลูกค้า</CardTitle>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                เลือกคำขอด้านซ้าย ตรวจข้อมูลรถ แล้วส่งราคาตลาด ราคาศูนย์รับซื้อ และราคาที่ควรตั้งขายกลับไปในแชตลูกค้า
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-zinc-300 text-center text-sm text-muted-foreground">
              ยังไม่มีคำขอประเมินราคา เมื่อลูกค้ากดประเมินจากหน้าขายรถ รายการจะมาอยู่ตรงนี้
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
              <div className="grid content-start gap-2">
                {requests.map((request) => (
                  <RequestButton
                    isSelected={request.id === selectedRequest?.id}
                    key={request.id}
                    onClick={() => setSelectedId(request.id)}
                    request={request}
                  />
                ))}
              </div>

              {selectedRequest ? (
                <div className="space-y-4">
                  <VehicleSummary request={selectedRequest} />
                  <MessageList request={selectedRequest} />
                  <div className="flex gap-2">
                    <Input
                      className="h-11"
                      onChange={(event) => setAdminMessage(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="พิมพ์ข้อความหาเจ้าของรถ"
                      value={adminMessage}
                    />
                    <Button onClick={handleSendMessage} type="button" variant="premium">
                      <Send />
                      ส่ง
                    </Button>
                  </div>
                </div>
              ) : null}

              {selectedRequest && draft ? (
                <div className="space-y-4">
                  <Card className="bg-zinc-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="h-5 w-5 text-emerald-700" />
                        ส่งผลประเมิน
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <PriceInput
                        label="ราคาตลาดตอนนี้"
                        onChange={(value) => updateDraft("marketPriceTHB", value)}
                        value={draft.marketPriceTHB}
                      />
                      <PriceInput
                        label="ศูนย์รถมือ 2 รับซื้อ"
                        onChange={(value) => updateDraft("dealerBuyPriceTHB", value)}
                        value={draft.dealerBuyPriceTHB}
                      />
                      <PriceInput
                        label="แนะนำให้ตั้งขาย"
                        onChange={(value) => updateDraft("recommendedListPriceTHB", value)}
                        value={draft.recommendedListPriceTHB}
                      />
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-700">คำแนะนำเพิ่มเติม</label>
                        <textarea
                          className="min-h-28 w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                          onChange={(event) => updateDraft("note", event.target.value)}
                          value={draft.note}
                        />
                      </div>
                      <Button className="w-full" onClick={handleSendAssessment} type="button" variant="accent">
                        <MessageCircle />
                        แจ้งราคากลับลูกค้า
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function RequestButton({
  isSelected,
  onClick,
  request
}: {
  isSelected: boolean;
  onClick: () => void;
  request: ValuationRequest;
}) {
  return (
    <button
      className={cn(
        "rounded-lg border px-4 py-3 text-left transition",
        isSelected ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 bg-white hover:bg-zinc-50"
      )}
      onClick={onClick}
      type="button"
    >
      <p className="font-semibold">{buildVehicleTitle(request.vehicle)}</p>
      <p className={cn("mt-1 text-xs", isSelected ? "text-zinc-300" : "text-zinc-500")}>
        {request.contact.sellerName} ·{" "}
        {request.listing
          ? "ลูกค้าลงประกาศแล้ว"
          : request.status === "assessed"
            ? "แจ้งราคาแล้ว"
            : "รอประเมิน"}
      </p>
    </button>
  );
}

function VehicleSummary({ request }: { request: ValuationRequest }) {
  const rows = [
    ["เลขไมล์", request.vehicle.mileageKM],
    ["เกียร์", request.vehicle.transmission],
    ["เชื้อเพลิง", request.vehicle.fuelType],
    ["ระบบขับเคลื่อน", request.vehicle.driveTrain],
    ["เครื่องยนต์", request.vehicle.engine],
    ["สีภายนอก", request.vehicle.exteriorColor],
    ["ภายใน", request.vehicle.interiorColor],
    ["ตอนซื้อมาเป็นรถมือ", request.vehicle.ownerSummary],
    ["สภาพโดยรวม", request.vehicle.conditionSummary]
  ];

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xl font-semibold text-zinc-950">
            {buildVehicleTitle(request.vehicle)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {request.vehicle.location} · ลูกค้าคิดราคาไว้ {request.vehicle.expectedPriceTHB} บาท
          </p>
        </div>
        <Badge variant={request.listing || request.status === "assessed" ? "success" : "warning"}>
          {request.listing
            ? "ลูกค้าลงประกาศแล้ว"
            : request.status === "assessed"
              ? "ประเมินแล้ว"
              : "รอประเมิน"}
        </Badge>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div className="rounded-md border border-zinc-200 bg-white px-3 py-2" key={label}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 font-semibold text-zinc-950">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm leading-6 text-zinc-700">
        {request.vehicle.description}
      </p>
    </div>
  );
}

function PriceInput({
  label,
  onChange,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  value: number;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-zinc-700">{label}</label>
      <Input
        className="h-11 bg-white"
        onChange={(event) => onChange(event.target.value)}
        value={formatTHB(value)}
      />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="bg-white">
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-zinc-950">{value}</p>
      </CardContent>
    </Card>
  );
}

function getDraft(
  request: ValuationRequest,
  drafts: Record<string, AssessmentDraft>
) {
  return (
    drafts[request.id] ?? {
      marketPriceTHB: request.finalAssessment?.marketPriceTHB ?? request.preliminaryAssessment.marketPriceTHB,
      dealerBuyPriceTHB:
        request.finalAssessment?.dealerBuyPriceTHB ?? request.preliminaryAssessment.dealerBuyPriceTHB,
      recommendedListPriceTHB:
        request.finalAssessment?.recommendedListPriceTHB ??
        request.preliminaryAssessment.recommendedListPriceTHB,
      note:
        request.finalAssessment?.note ??
        "ราคานี้เป็นการประเมินเบื้องต้นจากสภาพรถ เลขไมล์ และราคาประกาศใกล้เคียงในตลาด"
    }
  );
}

function parsePrice(value: string) {
  const normalized = value.replace(/[^\d]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}
