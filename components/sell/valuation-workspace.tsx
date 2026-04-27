"use client";

import {
  CarFront,
  CircleCheck,
  Gauge,
  MessageCircle,
  Send,
  Settings2,
  Sparkles,
  type LucideIcon,
  UserRound
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getStoredAccessToken } from "@/lib/auth-storage";
import {
  addSellerValuationMessage as addSellerValuationMessageApi,
  createSellerValuation,
  fetchSellerValuations,
  publishSellerValuation as publishSellerValuationApi
} from "@/lib/client-api";
import {
  buildVehicleTitle,
  calculatePreliminaryAssessment,
  formatTHB,
  type ValuationContactInput,
  type ValuationRequest,
  type ValuationVehicleInput
} from "@/lib/valuation-storage";
import { cn } from "@/lib/utils";

const initialVehicle: ValuationVehicleInput = {
  brand: "",
  model: "",
  year: "",
  expectedPriceTHB: "",
  location: "",
  mileageKM: "",
  transmission: "",
  fuelType: "",
  driveTrain: "",
  engine: "",
  exteriorColor: "",
  interiorColor: "",
  ownerSummary: "",
  conditionSummary: "",
  description: ""
};

const initialContact: ValuationContactInput = {
  sellerName: "",
  phone: "",
  email: ""
};

const basicFields = [
  { key: "brand", label: "ยี่ห้อ", placeholder: "เช่น BMW", icon: CarFront },
  { key: "model", label: "รุ่น", placeholder: "เช่น 320d M Sport", icon: CarFront },
  { key: "year", label: "ปีรถ", placeholder: "เช่น 2022", icon: Gauge },
  {
    key: "expectedPriceTHB",
    label: "ราคาที่คิดไว้",
    placeholder: "เช่น 1,690,000",
    icon: Sparkles
  },
  { key: "location", label: "พื้นที่รถ", placeholder: "เช่น กรุงเทพฯ", icon: Gauge }
] as const;

const detailFields = [
  { key: "mileageKM", label: "เลขไมล์", placeholder: "เช่น 51,200 กม.", icon: Gauge },
  { key: "transmission", label: "เกียร์", placeholder: "เช่น อัตโนมัติ / PDK 7 สปีด", icon: Settings2 },
  { key: "fuelType", label: "เชื้อเพลิง", placeholder: "เช่น เบนซิน / ดีเซล / EV", icon: Settings2 },
  { key: "driveTrain", label: "ระบบขับเคลื่อน", placeholder: "เช่น FWD / RWD / AWD", icon: Settings2 },
  { key: "engine", label: "เครื่องยนต์", placeholder: "เช่น 2.0L Turbo", icon: Settings2 },
  { key: "exteriorColor", label: "สีภายนอก", placeholder: "เช่น Jet Black", icon: Sparkles },
  { key: "interiorColor", label: "ภายใน", placeholder: "เช่น Leather ดำ", icon: Sparkles },
  { key: "ownerSummary", label: "ตอนซื้อมาเป็นรถมือ", placeholder: "เช่น รถมือ 1 / รถมือ 2", icon: UserRound },
  { key: "conditionSummary", label: "สภาพโดยรวม", placeholder: "เช่น ไม่เคยชนหนัก เข้าศูนย์ตลอด", icon: Sparkles }
] as const;

export function ValuationWorkspace() {
  const [requests, setRequests] = useState<ValuationRequest[]>([]);
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [contact, setContact] = useState(initialContact);
  const [activeId, setActiveId] = useState("");
  const [sellerMessage, setSellerMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [askingPriceByRequest, setAskingPriceByRequest] = useState<Record<string, string>>({});
  const [publishMessage, setPublishMessage] = useState("");
  const [publishError, setPublishError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadRequests() {
      try {
        const nextRequests = sortValuationRequests(await fetchSellerValuations());

        if (!isMounted) {
          return;
        }

        setRequests(nextRequests);
        setActiveId((currentId) =>
          nextRequests.some((request) => request.id === currentId)
            ? currentId
            : nextRequests[0]?.id ?? ""
        );
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เนเธซเธฅเธ”เธเธณเธเธญเธเธฃเธฐเน€เธกเธดเธเนเธ”เน"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeRequest =
    requests.find((request) => request.id === activeId) ?? requests[0] ?? null;
  const previewAssessment = useMemo(
    () => calculatePreliminaryAssessment(vehicle),
    [vehicle]
  );
  const activeAssessment =
    activeRequest?.finalAssessment ?? activeRequest?.preliminaryAssessment ?? null;
  const activeAskingPrice = activeRequest
    ? askingPriceByRequest[activeRequest.id] ??
      (activeRequest.listing || !activeAssessment
        ? ""
        : formatTHB(activeAssessment.recommendedListPriceTHB))
    : "";

  function updateVehicle(key: keyof ValuationVehicleInput, value: string) {
    setVehicle((current) => ({ ...current, [key]: value }));
  }

  function updateContact(key: keyof ValuationContactInput, value: string) {
    setContact((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const missingVehicle = [...basicFields, ...detailFields].some(
      (field) => !vehicle[field.key].trim()
    );
    const missingContact = !contact.sellerName.trim() || !contact.phone.trim() || !contact.email.trim();

    if (missingVehicle || missingContact || !vehicle.description.trim()) {
      setErrorMessage("กรุณากรอกข้อมูลรถเบื้องต้น รายละเอียดรถ และข้อมูลติดต่อให้ครบก่อนประเมินราคา");
      return;
    }

    setIsSubmitting(true);

    try {
      const request = await createSellerValuation(getStoredAccessToken(), {
        vehicle,
        contact
      });

      setRequests((currentRequests) =>
        upsertValuationRequest(currentRequests, request)
      );
      setActiveId(request.id);
      setSuccessMessage("สร้างคำขอเรียบร้อยแล้ว คุณกำหนดราคาขายและลงประกาศได้ทันทีจากช่องด้านล่าง");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "ไม่สามารถสร้างคำขอประเมินได้"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSendSellerMessage() {
    const text = sellerMessage.trim();
    if (!activeRequest || !text || isSending) {
      return;
    }

    setIsSending(true);

    try {
      const request = await addSellerValuationMessageApi(activeRequest.id, text);

      setRequests((currentRequests) =>
        upsertValuationRequest(currentRequests, request)
      );
      setSellerMessage("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "ไม่สามารถส่งข้อความได้"
      );
    } finally {
      setIsSending(false);
    }
  }

  async function handlePublishListing() {
    if (!activeRequest || isPublishing) {
      return;
    }

    setPublishError("");
    setPublishMessage("");

    const parsedAskingPrice = parsePrice(activeAskingPrice);
    if (!parsedAskingPrice) {
      setPublishError("กรุณากรอกราคาที่ต้องการตั้งขายก่อนลงประกาศ");
      return;
    }

    setIsPublishing(true);

    try {
      const request = await publishSellerValuationApi(
        activeRequest.id,
        parsedAskingPrice
      );
      const listing = request.listing;

      setRequests((currentRequests) =>
        upsertValuationRequest(currentRequests, request)
      );

      if (!listing) {
        setPublishError("ยังไม่พบข้อมูลรถสำหรับสร้างประกาศ กรุณาลองส่งข้อมูลใหม่อีกครั้ง");
        return;
      }

      setPublishMessage(
        `สร้างประกาศเรียบร้อย เลขอ้างอิง ${listing.id} เผยแพร่แล้วที่ราคา ${formatTHB(listing.priceTHB)}`
      );
    } catch (error) {
      setPublishError(
        error instanceof Error ? error.message : "ไม่สามารถลงประกาศได้"
      );
    } finally {
      setIsPublishing(false);
    }
  }

  function handleSelectRequest(requestId: string) {
    setActiveId(requestId);
    setPublishError("");
    setPublishMessage("");
  }

  function handleAskingPriceChange(value: string) {
    if (!activeRequest) {
      return;
    }

    setAskingPriceByRequest((current) => ({
      ...current,
      [activeRequest.id]: value
    }));
  }

  return (
    <section className="container pb-12 lg:pb-16">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Card className="bg-white">
            <CardHeader>
              <Badge className="w-fit" variant="success">
                Step 1
              </Badge>
              <CardTitle className="text-2xl">ข้อมูลรถเบื้องต้น</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {basicFields.map((field) => (
                <TextField
                  icon={field.icon}
                  key={field.key}
                  label={field.label}
                  onChange={(value) => updateVehicle(field.key, value)}
                  placeholder={field.placeholder}
                  value={vehicle[field.key]}
                />
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <Badge className="w-fit" variant="success">
                Step 2
              </Badge>
              <CardTitle className="text-2xl">รายละเอียดรถ</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {detailFields.map((field) => (
                <TextField
                  icon={field.icon}
                  key={field.key}
                  label={field.label}
                  onChange={(value) => updateVehicle(field.key, value)}
                  placeholder={field.placeholder}
                  value={vehicle[field.key]}
                />
              ))}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-zinc-700" htmlFor="description">
                  รายละเอียดเพิ่มเติม
                </label>
                <textarea
                  className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  id="description"
                  onChange={(event) => updateVehicle("description", event.target.value)}
                  placeholder="เล่าประวัติการใช้งาน การเข้าศูนย์ อุบัติเหตุ อุปกรณ์แต่ง หรือสิ่งที่ควรรู้ก่อนประเมิน"
                  value={vehicle.description}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <Badge className="w-fit" variant="success">
                Step 3
              </Badge>
              <CardTitle className="text-2xl">ข้อมูลติดต่อผู้ขาย</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <TextField
                icon={UserRound}
                label="ชื่อผู้ขาย"
                onChange={(value) => updateContact("sellerName", value)}
                placeholder="ชื่อ - นามสกุล"
                value={contact.sellerName}
              />
              <TextField
                icon={MessageCircle}
                label="เบอร์โทร"
                onChange={(value) => updateContact("phone", value)}
                placeholder="08x-xxx-xxxx"
                value={contact.phone}
              />
              <TextField
                icon={MessageCircle}
                label="อีเมล"
                onChange={(value) => updateContact("email", value)}
                placeholder="you@example.com"
                value={contact.email}
              />
            </CardContent>
          </Card>

          {errorMessage ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}
          {successMessage ? (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </p>
          ) : null}
          {isLoading ? (
            <p className="rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
              กำลังโหลดคำขอประเมินจากฐานข้อมูล...
            </p>
          ) : null}

          <Button
            className="h-12 w-full text-base sm:w-fit"
            disabled={isSubmitting}
            type="submit"
            variant="premium"
          >
            <Sparkles />
            {isSubmitting ? "กำลังบันทึก..." : "ประเมินราคาเบื้องต้น"}
          </Button>
        </form>

        <aside className="space-y-6">
          <Card className="sticky top-24 bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">ราคาประเมินจากข้อมูลที่กรอก</CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">
                ใช้เป็นแนวทางตั้งราคาขายเบื้องต้น คุณยังสามารถกำหนดราคาที่อยากขายเองเพื่อเผื่อต่อรองได้
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <PriceRow label="ราคาตลาดประมาณ" value={previewAssessment.marketPriceTHB} />
              <PriceRow label="ศูนย์มือ 2 รับซื้อประมาณ" value={previewAssessment.dealerBuyPriceTHB} />
              <PriceRow label="แนะนำตั้งขายประมาณ" value={previewAssessment.recommendedListPriceTHB} />
            </CardContent>
          </Card>
        </aside>
      </div>

      <CustomerChat
        activeRequest={activeRequest}
        askingPrice={activeAskingPrice}
        message={sellerMessage}
        onAskingPriceChange={handleAskingPriceChange}
        onMessageChange={setSellerMessage}
        onPublishListing={handlePublishListing}
        onSendMessage={handleSendSellerMessage}
        publishError={publishError}
        publishMessage={publishMessage}
        requests={requests}
        selectedId={activeRequest?.id ?? ""}
        onSelect={handleSelectRequest}
      />
    </section>
  );
}

function CustomerChat({
  activeRequest,
  askingPrice,
  message,
  onAskingPriceChange,
  onMessageChange,
  onSelect,
  onPublishListing,
  onSendMessage,
  publishError,
  publishMessage,
  requests,
  selectedId
}: {
  activeRequest: ValuationRequest | null;
  askingPrice: string;
  message: string;
  onAskingPriceChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onPublishListing: () => void;
  onSelect: (id: string) => void;
  onSendMessage: () => void;
  publishError: string;
  publishMessage: string;
  requests: ValuationRequest[];
  selectedId: string;
}) {
  if (!activeRequest) {
    return (
      <Card className="mt-8 bg-white">
        <CardContent className="flex min-h-32 items-center justify-center text-center text-sm text-muted-foreground">
          เมื่อกดประเมินราคา ระบบจะสร้างช่องแชตกับแอดมินไว้ตรงนี้
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>คำขอของคุณ</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {requests.map((request) => (
            <button
              className={cn(
                "rounded-md border px-3 py-3 text-left transition",
                request.id === selectedId
                  ? "border-zinc-950 bg-zinc-950 text-white"
                  : "border-zinc-200 hover:bg-zinc-50"
              )}
              key={request.id}
              onClick={() => onSelect(request.id)}
              type="button"
            >
              <p className="font-semibold">{buildVehicleTitle(request.vehicle)}</p>
              <p className={cn("mt-1 text-xs", request.id === selectedId ? "text-zinc-300" : "text-zinc-500")}>
                {request.listing
                  ? "ลงประกาศแล้ว"
                  : request.status === "assessed"
                    ? "แอดมินแจ้งราคาแล้ว"
                    : "พร้อมลงประกาศ"}
              </p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <Badge className="w-fit" variant={activeRequest.listing || activeRequest.status === "assessed" ? "success" : "warning"}>
            {activeRequest.listing
              ? "ลงประกาศแล้ว"
              : activeRequest.status === "assessed"
                ? "ประเมินแล้ว"
                : "พร้อมลงประกาศ"}
          </Badge>
          <CardTitle className="text-2xl">
            แชตประเมินราคา {buildVehicleTitle(activeRequest.vehicle)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MessageList request={activeRequest} />
          <PublishListingCard
            askingPrice={askingPrice}
            onAskingPriceChange={onAskingPriceChange}
            onPublishListing={onPublishListing}
            publishError={publishError}
            publishMessage={publishMessage}
            request={activeRequest}
          />
          <div className="flex gap-2">
            <Input
              className="h-11"
              onChange={(event) => onMessageChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onSendMessage();
                }
              }}
              placeholder="พิมพ์ข้อความถึงแอดมิน"
              value={message}
            />
            <Button onClick={onSendMessage} type="button" variant="premium">
              <Send />
              ส่ง
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PublishListingCard({
  askingPrice,
  onAskingPriceChange,
  onPublishListing,
  publishError,
  publishMessage,
  request
}: {
  askingPrice: string;
  onAskingPriceChange: (value: string) => void;
  onPublishListing: () => void;
  publishError: string;
  publishMessage: string;
  request: ValuationRequest;
}) {
  const assessment = request.finalAssessment ?? request.preliminaryAssessment;

  if (!assessment) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-4 py-3 text-sm text-muted-foreground">
        เมื่อมีข้อมูลรถครบแล้ว ตรงนี้จะมีปุ่มให้ลงประกาศได้ทันที
      </div>
    );
  }

  const listing = request.listing;

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-zinc-950">
            พร้อมลงประกาศขายรถคันนี้ไหม?
          </p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            ระบบจะใช้ข้อมูลรถจากคำขอนี้ คุณกำหนดราคาขายเองได้เพื่อเผื่อต่อรองกับผู้ซื้อ
          </p>
        </div>
        {listing ? (
          <Badge variant="success">
            <CircleCheck className="mr-1 h-3.5 w-3.5" />
            ลงขายแล้ว
          </Badge>
        ) : null}
      </div>

      {listing ? (
        <p className="mt-3 rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-700">
          สร้างประกาศแล้ว เลขอ้างอิง {listing.id} · เผยแพร่แล้วที่ราคา {formatTHB(listing.priceTHB)}
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">
              ราคาที่ต้องการตั้งขาย
            </label>
            <Input
              className="h-11 bg-white"
              onChange={(event) => onAskingPriceChange(event.target.value)}
              placeholder={formatTHB(assessment.recommendedListPriceTHB)}
              value={askingPrice}
            />
            <p className="text-xs leading-5 text-zinc-500">
              ตั้งเผื่อต่อรองได้ ระบบจะเผยแพร่ประกาศทันทีโดยไม่ต้องรอแอดมินอนุมัติ
            </p>
          </div>
          <Button className="self-start sm:mt-7" onClick={onPublishListing} type="button" variant="accent">
            <CircleCheck />
            ลงประกาศทันที
          </Button>
        </div>
      )}

      {publishMessage ? (
        <p className="mt-3 rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-700">
          {publishMessage}
        </p>
      ) : null}
      {publishError ? (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {publishError}
        </p>
      ) : null}
    </div>
  );
}

export function MessageList({ request }: { request: ValuationRequest }) {
  return (
    <div className="max-h-[460px] space-y-3 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3">
      {request.messages.map((message) => (
        <div
          className={cn(
            "flex",
            message.sender === "seller" ? "justify-end" : "justify-start"
          )}
          key={message.id}
        >
          <div
            className={cn(
              "max-w-[82%] whitespace-pre-line rounded-lg px-4 py-3 text-sm leading-6",
              message.sender === "seller"
                ? "bg-zinc-950 text-white"
                : "border border-zinc-200 bg-white text-zinc-800"
            )}
          >
            <p>{message.text}</p>
            {message.assessment ? (
              <div className="mt-3 grid gap-2 border-t border-white/20 pt-3">
                <PriceRow label="ราคาตลาด" value={message.assessment.marketPriceTHB} />
                <PriceRow label="ศูนย์รับซื้อ" value={message.assessment.dealerBuyPriceTHB} />
                <PriceRow label="ควรตั้งขาย" value={message.assessment.recommendedListPriceTHB} />
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 bg-white px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold text-zinc-950">{formatTHB(value)}</span>
    </div>
  );
}

function upsertValuationRequest(
  requests: ValuationRequest[],
  request: ValuationRequest
) {
  return sortValuationRequests([
    request,
    ...requests.filter((item) => item.id !== request.id)
  ]);
}

function sortValuationRequests(requests: ValuationRequest[]) {
  return [...requests].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function parsePrice(value: string) {
  const normalized = value.replace(/[^\d]/g, "");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function TextField({
  icon: Icon,
  label,
  onChange,
  placeholder,
  value
}: {
  icon: LucideIcon;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-zinc-700">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-700" />
        <Input
          className="h-12 bg-white pl-10"
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
      </div>
    </div>
  );
}
