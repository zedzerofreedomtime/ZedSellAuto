export type ApiUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
};

export type ApiVehicleCategory = {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  count: number;
};

export type ApiVehicle = {
  id: string;
  slug: string;
  categorySlug: string;
  name: string;
  year: number;
  priceTHB: number;
  monthlyPaymentTHB: number;
  location: string;
  mileageKM: number;
  fuelType: string;
  tag: string;
  tone: string;
  imageUrl: string;
  gallery: string[];
  transmission: string;
  driveTrain: string;
  engine: string;
  exteriorColor: string;
  interiorColor: string;
  seats: number;
  ownerSummary: string;
  description: string;
  sellerName: string;
  sellerEmailVerified: boolean;
  sellerPhoneVerified: boolean;
  sellerZedPayReady: boolean;
  isFeatured: boolean;
  estimatedMarketPrice?: number;
  nearbyListingCount?: number;
  avgDaysOnMarket?: number;
};

export type ApiPricingHighlight = {
  label: string;
  value: string;
};

export type ApiPricingPlan = {
  title: string;
  description: string;
  priceLabel: string;
  highlight?: string;
  features: string[];
};

export type ApiPricingFaq = {
  question: string;
  answer: string;
};

export type ApiHowItWorksStep = {
  label: string;
  title: string;
  description: string;
};

export type ApiTrustSignal = {
  title: string;
  description: string;
  icon: string;
};

export type ApiBlogSection = {
  heading: string;
  body: string[];
};

export type ApiBlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  publishedAt: string;
  readTimeMinutes: number;
  author: string;
  sections?: ApiBlogSection[];
  isFeatured: boolean;
};

export type ApiHomePayload = {
  featuredVehicles: ApiVehicle[];
  categories: ApiVehicleCategory[];
  featuredPost?: ApiBlogPost;
};

export type ApiVehicleListResponse = {
  vehicles: ApiVehicle[];
};

export type ApiVehicleCategoriesResponse = {
  categories: ApiVehicleCategory[];
};

export type ApiVehicleDetailResponse = {
  vehicle: ApiVehicle;
  related: ApiVehicle[];
  services: Array<{
    title: string;
  }>;
};

export type ApiBlogPostsResponse = {
  posts: ApiBlogPost[];
};

export type ApiBlogDetailResponse = {
  post: ApiBlogPost;
  related: ApiBlogPost[];
};

export type ApiPricingResponse = {
  highlights: ApiPricingHighlight[];
  plans: ApiPricingPlan[];
  faqs: ApiPricingFaq[];
};

export type ApiHowItWorksResponse = {
  trustSignals: ApiTrustSignal[];
  steps: ApiHowItWorksStep[];
  buyer: string[];
  seller: string[];
};

export type ApiAuthResponse = {
  user: ApiUser;
  accessToken: string;
};
