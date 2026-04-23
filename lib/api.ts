import {
  carCategories as fallbackCategories,
  getCategoryCount,
  getRelatedVehicles as getFallbackRelatedVehicles,
  getVehicleBySlug as getFallbackVehicleBySlug,
  getVehiclesByCategory as getFallbackVehiclesByCategory,
  type CarCategory,
  type CarCategorySlug,
  type Vehicle,
  vehicles as fallbackVehicles
} from "@/lib/car-data";
import {
  blogPosts as fallbackBlogPosts,
  buyerExperience as fallbackBuyerExperience,
  getBlogPostBySlug as getFallbackBlogPostBySlug,
  getRelatedBlogPosts as getFallbackRelatedBlogPosts,
  howItWorksSteps as fallbackHowItWorksSteps,
  pricingFaqs as fallbackPricingFaqs,
  pricingHighlights as fallbackPricingHighlights,
  pricingPlans as fallbackPricingPlans,
  sellerExperience as fallbackSellerExperience,
  type BlogPost,
  type HowItWorksStep,
  type PricingFaq,
  type PricingPlan
} from "@/lib/resources-data";

export type VehicleCategorySummary = CarCategory & {
  count: number;
};

export type PricingHighlight = {
  label: string;
  value: string;
};

export type HomePageData = {
  categories: VehicleCategorySummary[];
  featuredPost: BlogPost | null;
  featuredVehicles: Vehicle[];
};

export type VehicleDetailData = {
  related: Vehicle[];
  services: Array<{
    title: string;
  }>;
  vehicle: Vehicle;
};

export type BlogDetailData = {
  post: BlogPost;
  related: BlogPost[];
};

export type PricingPageData = {
  faqs: PricingFaq[];
  highlights: PricingHighlight[];
  plans: PricingPlan[];
};

export type HowItWorksPageData = {
  buyer: string[];
  seller: string[];
  steps: HowItWorksStep[];
  trustSignals: Array<{
    description: string;
    icon: string;
    title: string;
  }>;
};

type ApiVehicleCategory = {
  count: number;
  description: string;
  imageUrl: string;
  slug: CarCategorySlug;
  title: string;
};

type ApiVehicle = {
  avgDaysOnMarket?: number;
  categorySlug: Exclude<CarCategorySlug, "all">;
  description: string;
  driveTrain: string;
  engine: string;
  estimatedMarketPrice?: number;
  exteriorColor: string;
  fuelType: string;
  gallery: string[];
  id: string;
  imageUrl: string;
  interiorColor: string;
  isFeatured?: boolean;
  location: string;
  mileageKM: number;
  monthlyPaymentTHB: number;
  name: string;
  nearbyListingCount?: number;
  ownerSummary: string;
  priceTHB: number;
  seats: number;
  sellerEmailVerified?: boolean;
  sellerName: string;
  sellerPhoneVerified?: boolean;
  sellerZedPayReady?: boolean;
  slug: string;
  tag: string;
  tone: "success" | "warning";
  transmission: string;
  year: number;
};

type ApiBlogPost = {
  author: string;
  category: string;
  excerpt: string;
  imageUrl: string;
  isFeatured?: boolean;
  publishedAt: string;
  readTimeMinutes: number;
  sections?: Array<{
    body: string[];
    heading: string;
  }>;
  slug: string;
  title: string;
};

type ApiResponseError = {
  error?: string;
};

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

function getServerApiBaseUrl() {
  return (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
    /\/$/,
    ""
  );
}

async function fetchJson<T>(path: string) {
  const baseUrl = getServerApiBaseUrl();

  if (!baseUrl) {
    throw new Error("Missing API_BASE_URL or NEXT_PUBLIC_API_BASE_URL in .env");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    cache: "no-store"
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as T | ApiResponseError) : null;

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
        ? payload.error
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status);
  }

  return payload as T;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(value);
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: 0
  }).format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

function mapApiVehicle(vehicle: ApiVehicle): Vehicle {
  return {
    id: vehicle.id,
    slug: vehicle.slug,
    name: vehicle.name,
    year: String(vehicle.year),
    price: formatCurrency(vehicle.priceTHB),
    numericPrice: vehicle.priceTHB,
    monthly: `${formatCurrency(vehicle.monthlyPaymentTHB)}/เดือน`,
    location: vehicle.location,
    mileage: `${formatInteger(vehicle.mileageKM)} กม.`,
    fuel: vehicle.fuelType,
    tag: vehicle.tag,
    tone: vehicle.tone,
    category: vehicle.categorySlug,
    image: vehicle.imageUrl,
    gallery: vehicle.gallery,
    transmission: vehicle.transmission,
    drive: vehicle.driveTrain,
    engine: vehicle.engine,
    exteriorColor: vehicle.exteriorColor,
    interiorColor: vehicle.interiorColor,
    seats: `${vehicle.seats} ที่นั่ง`,
    owner: vehicle.ownerSummary,
    description: vehicle.description,
    sellerName: vehicle.sellerName,
    sellerEmailVerified: vehicle.sellerEmailVerified,
    sellerPhoneVerified: vehicle.sellerPhoneVerified,
    sellerZedPayReady: vehicle.sellerZedPayReady,
    estimatedMarketPrice: vehicle.estimatedMarketPrice,
    nearbyListingCount: vehicle.nearbyListingCount,
    avgDaysOnMarket: vehicle.avgDaysOnMarket
  };
}

function mapApiBlogPost(post: ApiBlogPost): BlogPost {
  return {
    author: post.author,
    category: post.category,
    excerpt: post.excerpt,
    image: post.imageUrl,
    publishedAt: formatDate(post.publishedAt),
    readTime: `${post.readTimeMinutes} นาที`,
    sections: post.sections ?? [],
    slug: post.slug,
    title: post.title
  };
}

function fallbackCategorySummary(): VehicleCategorySummary[] {
  return fallbackCategories.map((category) => ({
    ...category,
    count: getCategoryCount(category.slug)
  }));
}

export async function getHomePageData(): Promise<HomePageData> {
  try {
    const payload = await fetchJson<{
      categories: ApiVehicleCategory[];
      featuredPost?: ApiBlogPost | null;
      featuredVehicles: ApiVehicle[];
    }>("/home");

    return {
      categories: payload.categories.map((category) => ({
        slug: category.slug,
        title: category.title,
        description: category.description,
        image: category.imageUrl,
        count: category.count
      })),
      featuredVehicles: payload.featuredVehicles.map(mapApiVehicle),
      featuredPost: payload.featuredPost ? mapApiBlogPost(payload.featuredPost) : null
    };
  } catch {
    return {
      categories: fallbackCategorySummary(),
      featuredVehicles: fallbackVehicles.slice(0, 3),
      featuredPost: fallbackBlogPosts[0] ?? null
    };
  }
}

export async function getVehicleCategories(): Promise<VehicleCategorySummary[]> {
  try {
    const payload = await fetchJson<{
      categories: ApiVehicleCategory[];
    }>("/vehicles/categories");

    return payload.categories.map((category) => ({
      slug: category.slug,
      title: category.title,
      description: category.description,
      image: category.imageUrl,
      count: category.count
    }));
  } catch {
    return fallbackCategorySummary();
  }
}

export async function getVehicles(category: CarCategorySlug = "all") {
  try {
    const searchParams = new URLSearchParams();
    if (category !== "all") {
      searchParams.set("category", category);
    }

    const payload = await fetchJson<{
      vehicles: ApiVehicle[];
    }>(`/vehicles${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`);

    return payload.vehicles.map(mapApiVehicle);
  } catch {
    return getFallbackVehiclesByCategory(category);
  }
}

export async function getVehicleDetail(slug: string): Promise<VehicleDetailData | null> {
  try {
    const payload = await fetchJson<{
      related: ApiVehicle[];
      services: Array<{
        title: string;
      }>;
      vehicle: ApiVehicle;
    }>(`/vehicles/${slug}`);

    return {
      vehicle: mapApiVehicle(payload.vehicle),
      related: payload.related.map(mapApiVehicle),
      services: payload.services
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    const vehicle = getFallbackVehicleBySlug(slug);
    if (!vehicle) {
      return null;
    }

    return {
      vehicle,
      related: getFallbackRelatedVehicles(vehicle, 3),
      services: [{ title: "Shipping" }, { title: "Insurance" }, { title: "Protection" }, { title: "Inspection" }]
    };
  }
}

export async function getBlogPosts() {
  try {
    const payload = await fetchJson<{
      posts: ApiBlogPost[];
    }>("/blog/posts");

    return payload.posts.map(mapApiBlogPost);
  } catch {
    return fallbackBlogPosts;
  }
}

export async function getBlogDetail(slug: string): Promise<BlogDetailData | null> {
  try {
    const payload = await fetchJson<{
      post: ApiBlogPost;
      related: ApiBlogPost[];
    }>(`/blog/posts/${slug}`);

    return {
      post: mapApiBlogPost(payload.post),
      related: payload.related.map(mapApiBlogPost)
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    const post = getFallbackBlogPostBySlug(slug);
    if (!post) {
      return null;
    }

    return {
      post,
      related: getFallbackRelatedBlogPosts(slug, 3)
    };
  }
}

export async function getPricingPageData(): Promise<PricingPageData> {
  try {
    const payload = await fetchJson<{
      faqs: PricingFaq[];
      highlights: PricingHighlight[];
      plans: Array<{
        description: string;
        features: string[];
        highlight?: string;
        priceLabel: string;
        title: string;
      }>;
    }>("/resources/pricing");

    return {
      highlights: payload.highlights,
      plans: payload.plans.map((plan) => ({
        title: plan.title,
        description: plan.description,
        features: plan.features,
        highlight: plan.highlight,
        price: plan.priceLabel
      })),
      faqs: payload.faqs
    };
  } catch {
    return {
      highlights: fallbackPricingHighlights,
      plans: fallbackPricingPlans,
      faqs: fallbackPricingFaqs
    };
  }
}

export async function getHowItWorksPageData(): Promise<HowItWorksPageData> {
  try {
    return await fetchJson<HowItWorksPageData>("/resources/how-it-works");
  } catch {
    return {
      trustSignals: [
        {
          icon: "shield-check",
          title: "ข้อมูลรถชัดเจน",
          description: "ดูประวัติรถ ภาพจริง และข้อมูลสำคัญก่อนตัดสินใจ"
        },
        {
          icon: "wallet",
          title: "คุมงบได้ง่าย",
          description: "มีเครื่องมือช่วยประเมินค่างวดและค่าใช้จ่ายรวม"
        },
        {
          icon: "circle-check",
          title: "ปิดดีลเป็นขั้นตอน",
          description: "ช่วยดูเรื่องนัดหมาย เอกสาร และการส่งมอบรถ"
        }
      ],
      steps: fallbackHowItWorksSteps,
      buyer: fallbackBuyerExperience,
      seller: fallbackSellerExperience
    };
  }
}
