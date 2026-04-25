import {
  blogPosts as fallbackBlogPosts,
  buyerExperience as fallbackBuyerExperience,
  howItWorksSteps as fallbackHowItWorksSteps,
  pricingFaqs as fallbackPricingFaqs,
  pricingHighlights as fallbackPricingHighlights,
  pricingPlans as fallbackPricingPlans,
  sellerExperience as fallbackSellerExperience
} from "@/lib/resources-data";
import {
  carCategories as fallbackCategories,
  getCategoryCount,
  getRelatedVehicles as getFallbackRelatedVehicles,
  getVehicleBySlug as getFallbackVehicleBySlug,
  getVehiclesByCategory as getFallbackVehiclesByCategory,
  vehicles as fallbackVehicles,
  type Vehicle as FallbackVehicle
} from "@/lib/car-data";
import { buildApiUrl } from "@/lib/api-config";
import {
  type ApiBlogDetailResponse,
  type ApiBlogPost,
  type ApiBlogPostsResponse,
  type ApiHomePayload,
  type ApiHowItWorksResponse,
  type ApiPricingResponse,
  type ApiVehicle,
  type ApiVehicleCategoriesResponse,
  type ApiVehicleCategory,
  type ApiVehicleDetailResponse,
  type ApiVehicleListResponse
} from "@/lib/api-types";

type RequestOptions = {
  allowNotFound?: boolean;
  init?: RequestInit;
};

async function fetchApi<T>(path: string, options: RequestOptions = {}) {
  const { allowNotFound = false, init } = options;

  try {
    const response = await fetch(buildApiUrl(path), {
      ...init,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(init?.headers ?? {})
      }
    });

    if (allowNotFound && response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function extractNumber(value: string) {
  const raw = value.replace(/[^\d]/g, "");
  return raw ? Number(raw) : 0;
}

function normalizeGallery(images: string[], fallbackImage: string) {
  return images.length > 0 ? images : [fallbackImage];
}

function ensureAllCategory(categories: ApiVehicleCategory[]) {
  if (categories.some((category) => category.slug === "all")) {
    return categories;
  }

  const totalCount = categories.reduce(
    (sum, category) => sum + (category.count || 0),
    0
  );

  const imageUrl =
    categories[0]?.imageUrl ??
    fallbackCategories[0]?.image ??
    fallbackVehicles[0]?.image;

  return [
    {
      slug: "all",
      title: "รวมรถทุกประเภท",
      description: "ดูรถมือสองทั้งหมดที่ผ่านการคัดเกรดจาก Zed Auto",
      imageUrl,
      count: totalCount
    },
    ...categories
  ];
}

function toApiVehicle(vehicle: FallbackVehicle): ApiVehicle {
  return {
    id: vehicle.slug,
    slug: vehicle.slug,
    categorySlug: vehicle.category,
    name: vehicle.name,
    year: Number(vehicle.year),
    priceTHB: vehicle.numericPrice,
    monthlyPaymentTHB: extractNumber(vehicle.monthly),
    location: vehicle.location,
    mileageKM: extractNumber(vehicle.mileage),
    fuelType: vehicle.fuel,
    tag: vehicle.tag,
    tone: vehicle.tone,
    imageUrl: vehicle.image,
    gallery: normalizeGallery(vehicle.gallery, vehicle.image),
    transmission: vehicle.transmission,
    driveTrain: vehicle.drive,
    engine: vehicle.engine,
    exteriorColor: vehicle.exteriorColor,
    interiorColor: vehicle.interiorColor,
    seats: extractNumber(vehicle.seats),
    ownerSummary: vehicle.owner,
    description: vehicle.description,
    sellerName: vehicle.sellerName,
    sellerEmailVerified: true,
    sellerPhoneVerified: true,
    sellerZedPayReady: true,
    isFeatured: true,
    estimatedMarketPrice: Math.round(vehicle.numericPrice * 1.04),
    nearbyListingCount: 128,
    avgDaysOnMarket: 12
  };
}

function toApiCategory(category: (typeof fallbackCategories)[number]): ApiVehicleCategory {
  return {
    slug: category.slug,
    title: category.title,
    description: category.description,
    imageUrl: category.image,
    count: getCategoryCount(category.slug)
  };
}

function toApiBlogPost(post: (typeof fallbackBlogPosts)[number]): ApiBlogPost {
  return {
    slug: post.slug,
    category: post.category,
    title: post.title,
    excerpt: post.excerpt,
    imageUrl: post.image,
    publishedAt: post.publishedAt,
    readTimeMinutes: extractNumber(post.readTime),
    author: post.author,
    sections: post.sections,
    isFeatured: false
  };
}

export async function getHomePayload(): Promise<ApiHomePayload> {
  const payload = await fetchApi<Partial<ApiHomePayload>>("/home");
  const fallbackPayload = {
    featuredVehicles: fallbackVehicles.slice(0, 4).map(toApiVehicle),
    categories: ensureAllCategory(fallbackCategories.map(toApiCategory)),
    featuredPost: fallbackBlogPosts[0] ? toApiBlogPost(fallbackBlogPosts[0]) : undefined
  } satisfies ApiHomePayload;

  if (!payload) {
    return fallbackPayload;
  }

  return {
    featuredVehicles: payload.featuredVehicles ?? fallbackPayload.featuredVehicles,
    categories: ensureAllCategory(payload.categories ?? fallbackPayload.categories),
    featuredPost: payload.featuredPost ?? fallbackPayload.featuredPost
  };
}

export async function getVehicleCategories(): Promise<ApiVehicleCategory[]> {
  const payload = await fetchApi<ApiVehicleCategoriesResponse>("/vehicles/categories");

  return ensureAllCategory(
    payload?.categories ?? fallbackCategories.map(toApiCategory)
  );
}

export async function getVehicles(category?: string, featuredOnly = false): Promise<ApiVehicle[]> {
  const query = new URLSearchParams();

  if (category && category !== "all") {
    query.set("category", category);
  }

  if (featuredOnly) {
    query.set("featured", "true");
  }

  const payload = await fetchApi<ApiVehicleListResponse>(
    `/vehicles${query.toString() ? `?${query.toString()}` : ""}`
  );

  if (payload?.vehicles) {
    return payload.vehicles.map((vehicle) => ({
      ...vehicle,
      gallery: normalizeGallery(vehicle.gallery, vehicle.imageUrl)
    }));
  }

  const source =
    category && category !== "all"
      ? getFallbackVehiclesByCategory(
          category as Parameters<typeof getFallbackVehiclesByCategory>[0]
        )
      : fallbackVehicles;

  return (featuredOnly ? source.slice(0, 4) : source).map(toApiVehicle);
}

export async function getVehicleDetail(slug: string) {
  const payload = await fetchApi<ApiVehicleDetailResponse>(`/vehicles/${slug}`, {
    allowNotFound: true
  });

  if (payload) {
    return {
      ...payload,
      vehicle: {
        ...payload.vehicle,
        gallery: normalizeGallery(payload.vehicle.gallery, payload.vehicle.imageUrl)
      },
      related: payload.related.map((vehicle) => ({
        ...vehicle,
        gallery: normalizeGallery(vehicle.gallery, vehicle.imageUrl)
      }))
    };
  }

  const vehicle = getFallbackVehicleBySlug(slug);
  if (!vehicle) {
    return null;
  }

  return {
    vehicle: toApiVehicle(vehicle),
    related: getFallbackRelatedVehicles(vehicle, 3).map(toApiVehicle),
    services: [
      { title: "Shipping" },
      { title: "Insurance" },
      { title: "Protection" },
      { title: "Inspection" }
    ]
  } satisfies ApiVehicleDetailResponse;
}

export async function getBlogPosts() {
  const payload = await fetchApi<ApiBlogPostsResponse>("/blog/posts");
  return payload?.posts ?? fallbackBlogPosts.map(toApiBlogPost);
}

export async function getBlogPost(slug: string) {
  const payload = await fetchApi<ApiBlogDetailResponse>(`/blog/posts/${slug}`, {
    allowNotFound: true
  });

  if (payload) {
    return payload;
  }

  const post = fallbackBlogPosts.find((item) => item.slug === slug);
  if (!post) {
    return null;
  }

  const related = fallbackBlogPosts
    .filter((item) => item.slug !== slug)
    .slice(0, 3)
    .map(toApiBlogPost);

  return {
    post: toApiBlogPost(post),
    related
  } satisfies ApiBlogDetailResponse;
}

export async function getPricingPayload(): Promise<ApiPricingResponse> {
  const payload = await fetchApi<ApiPricingResponse>("/resources/pricing");

  if (payload) {
    return payload;
  }

  return {
    highlights: fallbackPricingHighlights,
    plans: fallbackPricingPlans.map((plan) => ({
      title: plan.title,
      description: plan.description,
      priceLabel: plan.price,
      highlight: plan.highlight,
      features: plan.features
    })),
    faqs: fallbackPricingFaqs
  };
}

export async function getHowItWorksPayload(): Promise<ApiHowItWorksResponse> {
  const payload = await fetchApi<ApiHowItWorksResponse>("/resources/how-it-works");

  if (payload) {
    return payload;
  }

  return {
    trustSignals: [
      {
        title: "ข้อมูลรถชัดเจน",
        description:
          "ดูประวัติรถ ภาพจริง และข้อมูลสำคัญก่อนตัดสินใจได้ในหน้าเดียว",
        icon: "shield-check"
      },
      {
        title: "คุมงบได้ง่าย",
        description:
          "มีเครื่องมือช่วยประเมินค่างวดและค่าใช้จ่ายรวมก่อนคุยไฟแนนซ์จริง",
        icon: "wallet"
      },
      {
        title: "ปิดดีลเป็นขั้นตอน",
        description:
          "จัดการนัดหมาย เอกสาร และการส่งมอบรถได้เป็นลำดับจนจบดีล",
        icon: "circle-check"
      }
    ],
    steps: fallbackHowItWorksSteps,
    buyer: fallbackBuyerExperience,
    seller: fallbackSellerExperience
  };
}
