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

export type ValuationListing = {
  id: string;
  listedAt: string;
  priceTHB: number;
  sourceRequestId: string;
  status: "published";
  title: string;
};

export type StoredSellerListing = ValuationListing & {
  categorySlug?: string;
  contact: ValuationContactInput;
  createdByEmail?: string;
  imageUrls?: string[];
  vehicle: ValuationVehicleInput;
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
  listing?: ValuationListing;
  messages: ValuationMessage[];
};

const STORAGE_KEY = "zed_auto_valuation_requests";
const SELLER_LISTINGS_KEY = "zed_auto_seller_listings";
const STORAGE_EVENT = "zed-auto-valuations";
const SELLER_LISTINGS_EVENT = "zed-auto-seller-listings";

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

export function subscribeToSellerListings(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(SELLER_LISTINGS_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(SELLER_LISTINGS_EVENT, onStoreChange);
  };
}

export function getSellerListingsSnapshot() {
  if (typeof window === "undefined") {
    return "[]";
  }

  return window.localStorage.getItem(SELLER_LISTINGS_KEY) ?? "[]";
}

export function getServerSellerListingsSnapshot() {
  return "[]";
}

export function parseSellerListings(snapshot: string) {
  try {
    return JSON.parse(snapshot) as StoredSellerListing[];
  } catch {
    return [];
  }
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
        text: "ระบบบันทึกคำขอแล้ว คุณสามารถตั้งราคาขายและลงประกาศได้ทันที หรือคุยกับแอดมินเพื่อขอคำแนะนำราคาเพิ่มเติมได้ในแชตนี้",
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

export function publishValuationAsListing(requestId: string, askingPriceTHB?: number) {
  const requests = getRequests();
  const request = requests.find((item) => item.id === requestId);

  if (!request) {
    return null;
  }

  if (request.listing) {
    return request.listing;
  }

  const assessment = request.finalAssessment ?? request.preliminaryAssessment;
  const listedAt = new Date().toISOString();
  const priceTHB =
    askingPriceTHB && askingPriceTHB > 0
      ? askingPriceTHB
      : assessment.recommendedListPriceTHB;
  const listing: ValuationListing = {
    id: `seller-listing-${crypto.randomUUID()}`,
    listedAt,
    priceTHB,
    sourceRequestId: request.id,
    status: "published",
    title: buildVehicleTitle(request.vehicle)
  };

  saveSellerListing({
    ...listing,
    contact: request.contact,
    vehicle: request.vehicle
  });

  saveRequests(
    requests.map((item) =>
      item.id === requestId
        ? {
            ...item,
            listing,
            updatedAt: listedAt,
            messages: [
              ...item.messages,
              {
                id: crypto.randomUUID(),
                sender: "seller",
                text: `ลงประกาศ ${listing.title} แล้วที่ราคา ${formatTHB(listing.priceTHB)} โดยใช้ข้อมูลจากคำขอประเมินเดิม`,
                createdAt: listedAt
              },
              {
                id: crypto.randomUUID(),
                sender: "admin",
                text: "ประกาศเผยแพร่แล้ว ลูกค้าสามารถใช้ราคานี้เป็นราคาเผื่อต่อรองกับผู้ซื้อได้ทันที",
                createdAt: listedAt
              }
            ]
          }
        : item
    )
  );

  return listing;
}

export function saveDirectSellerListing(input: {
  contact: ValuationContactInput;
  imageUrls: string[];
  priceTHB: number;
  vehicle: ValuationVehicleInput;
}) {
  const listedAt = new Date().toISOString();
  const title = buildVehicleTitle(input.vehicle);
  const listing: StoredSellerListing = {
    id: `seller-listing-${crypto.randomUUID()}`,
    listedAt,
    priceTHB: input.priceTHB,
    sourceRequestId: `direct-sell-${crypto.randomUUID()}`,
    status: "published",
    title,
    categorySlug: inferSellerListingCategory(input.vehicle),
    contact: trimContactInput(input.contact),
    createdByEmail: input.contact.email.trim().toLowerCase(),
    imageUrls: input.imageUrls,
    vehicle: trimVehicleInput(input.vehicle)
  };

  saveSellerListing(listing);
  return listing;
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
    note: "เป็นราคาประเมินเบื้องต้นจากข้อมูลที่กรอก ผู้ขายสามารถใช้เป็นแนวทางตั้งราคาเผื่อต่อรองได้",
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

function saveSellerListing(listing: StoredSellerListing) {
  if (typeof window === "undefined") {
    return;
  }

  const existing = parseSellerListings(
    window.localStorage.getItem(SELLER_LISTINGS_KEY) ?? "[]"
  ).filter((item) => item.sourceRequestId !== listing.sourceRequestId);

  window.localStorage.setItem(
    SELLER_LISTINGS_KEY,
    JSON.stringify([listing, ...existing])
  );
  window.dispatchEvent(new Event(SELLER_LISTINGS_EVENT));
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

function inferSellerListingCategory(vehicle: ValuationVehicleInput) {
  const text = [
    vehicle.brand,
    vehicle.model,
    vehicle.fuelType,
    vehicle.driveTrain,
    vehicle.engine
  ]
    .join(" ")
    .toLowerCase();

  if (/(ev|electric|ไฟฟ้า|tesla)/i.test(text)) {
    return "ev";
  }

  if (/(pickup|hilux|revo|ranger|d-max|triton|กระบะ)/i.test(text)) {
    return "pickup";
  }

  if (/(suv|macan|q5|rx|x3|x5|fortuner|pajero|cr-v|cx-5)/i.test(text)) {
    return "suv";
  }

  if (/(porsche|audi|lexus|mercedes|benz|bmw|luxury)/i.test(text)) {
    return "luxury";
  }

  return "sedan";
}
