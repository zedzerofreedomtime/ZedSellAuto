"use client";

import {
  CarFront,
  Gauge,
  MessageCircle,
  Send,
  Settings2,
  Sparkles,
  type LucideIcon,
  UserRound
} from "lucide-react";
import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  addSellerValuationMessage,
  buildVehicleTitle,
  calculatePreliminaryAssessment,
  createValuationRequest,
  formatTHB,
  getServerValuationSnapshot,
  getValuationSnapshot,
  parseValuationSnapshot,
  subscribeToValuationRequests,
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
  const snapshot = useSyncExternalStore(
    subscribeToValuationRequests,
    getValuationSnapshot,
    getServerValuationSnapshot
  );
  const requests = useMemo(() => parseValuationSnapshot(snapshot), [snapshot]);
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [contact, setContact] = useState(initialContact);
  const [activeId, setActiveId] = useState("");
  const [sellerMessage, setSellerMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const activeRequest =
    requests.find((request) => request.id === activeId) ?? requests[0] ?? null;
  const previewAssessment = useMemo(
    () => calculatePreliminaryAssessment(vehicle),
    [vehicle]
  );

  function updateVehicle(key: keyof ValuationVehicleInput, value: string) {
    setVehicle((current) => ({ ...current, [key]: value }));
  }

  function updateContact(key: keyof ValuationContactInput, value: string) {
    setContact((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    const request = createValuationRequest({ vehicle, contact });
    setActiveId(request.id);
    setSuccessMessage("ส่งข้อมูลให้แอดมินแล้ว ตอนนี้คุยต่อในช่องแชตด้านล่างได้เลย");
  }

  function handleSendSellerMessage() {
    const text = sellerMessage.trim();
    if (!activeRequest || !text) {
      return;
    }

    addSellerValuationMessage(activeRequest.id, text);
    setSellerMessage("");
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

          <Button className="h-12 w-full text-base sm:w-fit" type="submit" variant="premium">
            <Sparkles />
            ประเมินราคาเบื้องต้น
          </Button>
        </form>

        <aside className="space-y-6">
          <Card className="sticky top-24 bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">ราคาประเมินจากข้อมูลที่กรอก</CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">
                ค่านี้เป็นตัวช่วยเบื้องต้นเท่านั้น แอดมินจะตรวจราคาในตลาดและแจ้งกลับผ่านแชต
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
        message={sellerMessage}
        onMessageChange={setSellerMessage}
        onSendMessage={handleSendSellerMessage}
        requests={requests}
        selectedId={activeRequest?.id ?? ""}
        onSelect={setActiveId}
      />
    </section>
  );
}

function CustomerChat({
  activeRequest,
  message,
  onMessageChange,
  onSelect,
  onSendMessage,
  requests,
  selectedId
}: {
  activeRequest: ValuationRequest | null;
  message: string;
  onMessageChange: (value: string) => void;
  onSelect: (id: string) => void;
  onSendMessage: () => void;
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
                {request.status === "assessed" ? "แอดมินแจ้งราคาแล้ว" : "รอแอดมินประเมิน"}
              </p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <Badge className="w-fit" variant={activeRequest.status === "assessed" ? "success" : "warning"}>
            {activeRequest.status === "assessed" ? "ประเมินแล้ว" : "รอประเมิน"}
          </Badge>
          <CardTitle className="text-2xl">
            แชตประเมินราคา {buildVehicleTitle(activeRequest.vehicle)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MessageList request={activeRequest} />
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
