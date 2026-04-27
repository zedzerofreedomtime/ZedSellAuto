export type ValuationStatus = "assessed" | "pending";

export type ValuationVehicleInput = {
  brand: string;
  model: string;
  year: string;
  expectedPriceTHB: string;
  location: string;
  mileageKM: string;
  transmission: string;
  fuelType: string;
  driveTrain: string;
  engine: string;
  exteriorColor: string;
  interiorColor: string;
  ownerSummary: string;
  conditionSummary: string;
  description: string;
};

export type ValuationContactInput = {
  sellerName: string;
  phone: string;
  email: string;
};

export type ValuationAssessment = {
  marketPriceTHB: number;
  dealerBuyPriceTHB: number;
  recommendedListPriceTHB: number;
  note: string;
  estimatedAt: string;
};

export type ValuationMessage = {
  id: string;
  sender: "admin" | "seller";
  text: string;
  createdAt: string;
  assessment?: ValuationAssessment;
};

export type ValuationRequest = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ValuationStatus;
  vehicle: ValuationVehicleInput;
  contact: ValuationContactInput;
  preliminaryAssessment: ValuationAssessment;
  finalAssessment?: ValuationAssessment;
  messages: ValuationMessage[];
};

const STORAGE_KEY = "zed_auto_valuation_requests";
const STORAGE_EVENT = "zed-auto-valuations";

export function subscribeToValuationRequests(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
  };
}

export function getValuationSnapshot() {
  if (typeof window === "undefined") {
    return "[]";
  }

  return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
}

export function getServerValuationSnapshot() {
  return "[]";
}

export function parseValuationSnapshot(snapshot: string) {
  try {
    const parsed = JSON.parse(snapshot) as ValuationRequest[];
    return parsed.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

export function createValuationRequest(input: {
  contact: ValuationContactInput;
  vehicle: ValuationVehicleInput;
}) {
  const now = new Date().toISOString();
  const preliminaryAssessment = calculatePreliminaryAssessment(input.vehicle);
  const request: ValuationRequest = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: "pending",
    vehicle: trimVehicleInput(input.vehicle),
    contact: trimContactInput(input.contact),
    preliminaryAssessment,
    messages: [
      {
        id: crypto.randomUUID(),
        sender: "seller",
        text: `ส่งข้อมูล ${buildVehicleTitle(input.vehicle)} เพื่อขอประเมินราคาเบื้องต้น`,
        createdAt: now
      },
      {
        id: crypto.randomUUID(),
        sender: "admin",
        text: "ระบบรับคำขอแล้ว แอดมินจะตรวจราคาตลาดและแจ้งราคากลับในแชตนี้",
        createdAt: now
      }
    ]
  };

  saveRequests([request, ...getRequests()]);
  return request;
}

export function addSellerValuationMessage(requestId: string, text: string) {
  appendMessage(requestId, {
    id: crypto.randomUUID(),
    sender: "seller",
    text,
    createdAt: new Date().toISOString()
  });
}

export function addAdminValuationMessage(requestId: string, text: string) {
  appendMessage(requestId, {
    id: crypto.randomUUID(),
    sender: "admin",
    text,
    createdAt: new Date().toISOString()
  });
}

export function sendAdminValuationAssessment(
  requestId: string,
  assessment: Omit<ValuationAssessment, "estimatedAt">
) {
  const estimatedAt = new Date().toISOString();
  const finalAssessment = {
    ...assessment,
    estimatedAt
  };

  updateRequest(requestId, (request) => ({
    ...request,
    status: "assessed",
    finalAssessment,
    updatedAt: estimatedAt,
    messages: [
      ...request.messages,
      {
        id: crypto.randomUUID(),
        sender: "admin",
        text: buildAssessmentMessage(finalAssessment),
        createdAt: estimatedAt,
        assessment: finalAssessment
      }
    ]
  }));
}

export function calculatePreliminaryAssessment(
  vehicle: ValuationVehicleInput
): ValuationAssessment {
  const expectedPrice = parseNumber(vehicle.expectedPriceTHB);
  const mileage = parseNumber(vehicle.mileageKM);
  const age = Math.max(0, new Date().getFullYear() - parseNumber(vehicle.year));
  const mileageFactor = mileage > 160000 ? 0.9 : mileage > 90000 ? 0.95 : 1;
  const ageFactor = Math.max(0.86, 1 - age * 0.012);
  const basePrice = Math.max(expectedPrice, 300000);
  const marketPriceTHB = roundToThousand(basePrice * ageFactor * mileageFactor);
  const dealerBuyPriceTHB = roundToThousand(marketPriceTHB * 0.82);
  const recommendedListPriceTHB = roundToThousand(marketPriceTHB * 0.94);

  return {
    marketPriceTHB,
    dealerBuyPriceTHB,
    recommendedListPriceTHB,
    note: "เป็นราคาประเมินเบื้องต้นจากข้อมูลที่กรอก แอดมินจะตรวจอีกครั้งก่อนแจ้งราคาสุดท้าย",
    estimatedAt: new Date().toISOString()
  };
}

export function formatTHB(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(value);
}

export function buildVehicleTitle(vehicle: ValuationVehicleInput) {
  return [vehicle.year, vehicle.brand, vehicle.model]
    .map((item) => item.trim())
    .filter(Boolean)
    .join(" ");
}

function getRequests() {
  return parseValuationSnapshot(getValuationSnapshot());
}

function saveRequests(requests: ValuationRequest[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function updateRequest(
  requestId: string,
  updater: (request: ValuationRequest) => ValuationRequest
) {
  saveRequests(
    getRequests().map((request) =>
      request.id === requestId ? updater(request) : request
    )
  );
}

function appendMessage(requestId: string, message: ValuationMessage) {
  updateRequest(requestId, (request) => ({
    ...request,
    updatedAt: message.createdAt,
    messages: [...request.messages, message]
  }));
}

function parseNumber(value: string) {
  const normalized = value.replace(/[^\d]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function roundToThousand(value: number) {
  return Math.round(value / 1000) * 1000;
}

function trimVehicleInput(vehicle: ValuationVehicleInput) {
  return Object.fromEntries(
    Object.entries(vehicle).map(([key, value]) => [key, value.trim()])
  ) as ValuationVehicleInput;
}

function trimContactInput(contact: ValuationContactInput) {
  return Object.fromEntries(
    Object.entries(contact).map(([key, value]) => [key, value.trim()])
  ) as ValuationContactInput;
}

function buildAssessmentMessage(assessment: ValuationAssessment) {
  return [
    "ประเมินราคาเบื้องต้นเรียบร้อยแล้ว",
    `ราคาตลาดประมาณ ${formatTHB(assessment.marketPriceTHB)}`,
    `ศูนย์รถมือสองมักรับซื้อประมาณ ${formatTHB(assessment.dealerBuyPriceTHB)}`,
    `แนะนำให้ตั้งขายประมาณ ${formatTHB(assessment.recommendedListPriceTHB)}`,
    assessment.note
  ].join("\n");
}
