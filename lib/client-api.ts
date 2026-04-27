import type {
  StoredSellerListing,
  ValuationAssessment,
  ValuationContactInput,
  ValuationRequest,
  ValuationVehicleInput
} from "@/lib/valuation-storage";

type RequestOptions = {
  body?: unknown;
  method?: "POST" | "DELETE" | "GET";
  token?: string;
};

type AuthResponse = {
  accessToken: string;
  user: {
    createdAt: string;
    email: string;
    fullName: string;
    id: string;
    role: string;
  };
};

const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

function getApiBaseUrl() {
  if (!PUBLIC_API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL in .env");
  }

  return PUBLIC_API_BASE_URL;
}

async function request<T>({ body, method = "GET", token }: RequestOptions, path: string) {
  const headers: Record<string, string> = {};

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  const payload = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return payload as T;
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

export async function signupUser(input: {
  email: string;
  fullName: string;
  password: string;
}) {
  return request<AuthResponse>(
    {
      method: "POST",
      body: input
    },
    "/auth/signup"
  );
}

export async function loginUser(input: {
  email: string;
  password: string;
}) {
  return request<AuthResponse>(
    {
      method: "POST",
      body: input
    },
    "/auth/login"
  );
}

export async function addFavorite(vehicleId: string, token: string) {
  await request(
    {
      method: "POST",
      token
    },
    `/favorites/${vehicleId}`
  );
}

export async function removeFavorite(vehicleId: string, token: string) {
  await request(
    {
      method: "DELETE",
      token
    },
    `/favorites/${vehicleId}`
  );
}

export async function submitOffer(
  token: string,
  body: {
    email: string;
    fullName: string;
    note: string;
    offerAmountTHB: number;
    phone: string;
    vehicleId: string;
  }
) {
  await request(
    {
      method: "POST",
      token,
      body
    },
    "/leads/offers"
  );
}

export async function submitTestDrive(
  token: string,
  body: {
    email: string;
    fullName: string;
    note: string;
    phone: string;
    preferredAt: string;
    vehicleId: string;
  }
) {
  await request(
    {
      method: "POST",
      token,
      body
    },
    "/leads/test-drives"
  );
}

export async function submitInquiry(
  token: string,
  body: {
    channel: string;
    email: string;
    fullName: string;
    message: string;
    phone: string;
    vehicleId: string;
  }
) {
  await request(
    {
      method: "POST",
      token,
      body
    },
    "/leads/inquiries"
  );
}

export async function submitFinanceApplication(
  token: string,
  body: {
    creditBand: string;
    downPaymentPercent: number;
    email: string;
    fullName: string;
    loanTermMonths: number;
    monthlyIncomeTHB: number;
    phone: string;
    vehicleId: string;
  }
) {
  await request(
    {
      method: "POST",
      token,
      body
    },
    "/leads/finance"
  );
}

export async function submitSellerVehicle(
  token: string | null,
  body: {
    brand: string;
    description: string;
    driveTrain: string;
    email: string;
    engine: string;
    exteriorColor: string;
    fuelType: string;
    imageNames: string[];
    imageUrls: string[];
    interiorColor: string;
    location: string;
    mileageKM: number;
    model: string;
    ownerSummary: string;
    phone: string;
    priceTHB: number;
    sellerName: string;
    transmission: string;
    year: number;
  }
) {
  return request<{ id: string; listingId: string; status: string }>(
    {
      method: "POST",
      token: token ?? undefined,
      body
    },
    "/seller/vehicles"
  );
}

export async function fetchSellerValuations() {
  const payload = await request<{ requests: ValuationRequest[] }>(
    {
      method: "GET"
    },
    "/seller/valuations"
  );

  return payload.requests;
}

export async function createSellerValuation(
  token: string | null,
  body: {
    contact: ValuationContactInput;
    vehicle: ValuationVehicleInput;
  }
) {
  return request<ValuationRequest>(
    {
      method: "POST",
      token: token ?? undefined,
      body
    },
    "/seller/valuations"
  );
}

export async function addSellerValuationMessage(requestId: string, text: string) {
  return request<ValuationRequest>(
    {
      method: "POST",
      body: { text }
    },
    `/seller/valuations/${requestId}/messages`
  );
}

export async function publishSellerValuation(
  requestId: string,
  askingPriceTHB: number
) {
  return request<ValuationRequest>(
    {
      method: "POST",
      body: { askingPriceTHB }
    },
    `/seller/valuations/${requestId}/publish`
  );
}

export async function addAdminValuationMessage(requestId: string, text: string) {
  return request<ValuationRequest>(
    {
      method: "POST",
      body: { text }
    },
    `/admin/valuations/${requestId}/messages`
  );
}

export async function sendAdminValuationAssessment(
  requestId: string,
  assessment: Omit<ValuationAssessment, "estimatedAt">
) {
  return request<ValuationRequest>(
    {
      method: "POST",
      body: assessment
    },
    `/admin/valuations/${requestId}/assessment`
  );
}

export async function fetchSellerListings(category?: string) {
  const query = new URLSearchParams();

  if (category && category !== "all") {
    query.set("category", category);
  }

  const payload = await request<{ listings: StoredSellerListing[] }>(
    {
      method: "GET"
    },
    `/seller/listings${query.toString() ? `?${query.toString()}` : ""}`
  );

  return payload.listings;
}

export async function fetchSellerListing(listingId: string) {
  return request<StoredSellerListing>(
    {
      method: "GET"
    },
    `/seller/listings/${listingId}`
  );
}

