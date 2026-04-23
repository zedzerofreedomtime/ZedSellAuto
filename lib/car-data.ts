export type CarCategorySlug =
  | "all"
  | "suv"
  | "sedan"
  | "ev"
  | "pickup"
  | "luxury";

export type CarTone = "success" | "warning";

export type CarCategory = {
  count?: number;
  description: string;
  image: string;
  slug: CarCategorySlug;
  title: string;
};

export type Vehicle = {
  avgDaysOnMarket?: number;
  estimatedMarketPrice?: number;
  id?: string;
  slug: string;
  name: string;
  year: string;
  price: string;
  numericPrice: number;
  monthly: string;
  location: string;
  mileage: string;
  fuel: string;
  tag: string;
  tone: CarTone;
  category: Exclude<CarCategorySlug, "all">;
  image: string;
  gallery: string[];
  transmission: string;
  drive: string;
  engine: string;
  exteriorColor: string;
  interiorColor: string;
  seats: string;
  owner: string;
  description: string;
  sellerName: string;
  sellerEmailVerified?: boolean;
  sellerPhoneVerified?: boolean;
  sellerZedPayReady?: boolean;
  nearbyListingCount?: number;
};

function unsplashPhoto(photoId: string, width = 1200, quality = 80) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

const interiorImages = {
  bmw: [
    unsplashPhoto("photo-1734554250249-1b54d0c2e570", 900, 80),
    unsplashPhoto("photo-1689264048432-4788f2b14a19", 900, 80),
    unsplashPhoto("photo-1734554250249-1b54d0c2e570", 900, 70)
  ],
  mercedes: [
    unsplashPhoto("photo-1741089040480-238da1bf915c", 900, 80),
    unsplashPhoto("photo-1702413994078-0716b479bd26", 900, 80),
    unsplashPhoto("photo-1664626745301-a96a63bc7df0", 900, 80)
  ],
  porsche: [
    unsplashPhoto("photo-1673393663627-1cbca927ef18", 900, 80),
    unsplashPhoto("photo-1723361527079-d9e33406fa8d", 900, 80),
    unsplashPhoto("photo-1673393663627-1cbca927ef18", 900, 70)
  ],
  tesla: [
    unsplashPhoto("photo-1694889649741-6054088247fc", 900, 80),
    unsplashPhoto("photo-1694889650440-0e58c2db14c4", 900, 80),
    unsplashPhoto("photo-1685270386759-f95fe4f0b593", 900, 80)
  ],
  truck: [
    unsplashPhoto("photo-1675124516944-c257f7354c22", 900, 80),
    unsplashPhoto("photo-1675124516944-c257f7354c22", 900, 70),
    unsplashPhoto("photo-1675124516944-c257f7354c22", 900, 60)
  ]
};

function createVehicleGallery(image: string, interiors: string[]) {
  const baseImage = image.replace(/w=\d+/, "w=1400");

  return [
    baseImage,
    ...interiors,
    image.replace(/w=\d+/, "w=900")
  ];
}

export const vehicles: Vehicle[] = [
  {
    slug: "2022-bmw-320d-m-sport",
    name: "BMW 320d M Sport",
    year: "2022",
    price: "฿1,689,000",
    numericPrice: 1689000,
    monthly: "฿28,900/เดือน",
    location: "กรุงเทพฯ",
    mileage: "34,000 กม.",
    fuel: "ดีเซล",
    tag: "Top pick",
    tone: "success",
    category: "sedan",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    gallery: createVehicleGallery(
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      interiorImages.bmw
    ),
    transmission: "อัตโนมัติ",
    drive: "RWD",
    engine: "2.0L TwinPower Turbo",
    exteriorColor: "ขาว Alpine White",
    interiorColor: "ดำ Dakota",
    seats: "5 ที่นั่ง",
    owner: "เจ้าของเดิม 1 คน",
    description:
      "รถสภาพสวย ภายในสะอาด ประวัติเข้าศูนย์ครบ เครื่องยนต์และเกียร์ตอบสนองดี เหมาะกับผู้ที่ต้องการรถยุโรปขับสนุกแต่ยังใช้งานทุกวันได้สบาย",
    sellerName: "Zed Certified Bangkok"
  },
  {
    slug: "2021-mercedes-benz-c220d",
    name: "Mercedes-Benz C220d",
    year: "2021",
    price: "฿1,559,000",
    numericPrice: 1559000,
    monthly: "฿26,400/เดือน",
    location: "นนทบุรี",
    mileage: "42,500 กม.",
    fuel: "ดีเซล",
    tag: "Warranty",
    tone: "warning",
    category: "sedan",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
    gallery: createVehicleGallery(
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      interiorImages.mercedes
    ),
    transmission: "อัตโนมัติ 9G-Tronic",
    drive: "RWD",
    engine: "2.0L Diesel Turbo",
    exteriorColor: "เทา Selenite Grey",
    interiorColor: "ดำ Artico",
    seats: "5 ที่นั่ง",
    owner: "เจ้าของเดิม 1 คน",
    description:
      "C-Class ดีเซลยอดนิยม ขับนุ่ม ประหยัด และมีแพ็กเกจรับประกันเพิ่มเติม ตัวถังสวย เอกสารพร้อมโอน",
    sellerName: "Zed Certified Nonthaburi"
  },
  {
    slug: "2020-porsche-macan",
    name: "Porsche Macan",
    year: "2020",
    price: "฿3,290,000",
    numericPrice: 3290000,
    monthly: "฿54,700/เดือน",
    location: "เชียงใหม่",
    mileage: "51,200 กม.",
    fuel: "เบนซิน",
    tag: "New arrival",
    tone: "success",
    category: "suv",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    gallery: createVehicleGallery(
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      interiorImages.porsche
    ),
    transmission: "PDK 7 สปีด",
    drive: "AWD",
    engine: "2.0L Turbo",
    exteriorColor: "ดำ Jet Black",
    interiorColor: "ดำ Leather",
    seats: "5 ที่นั่ง",
    owner: "เจ้าของเดิม 2 คน",
    description:
      "SUV พรีเมียมขับสนุก ช่วงล่างแน่น ภายในดูแลดี เหมาะกับครอบครัวที่ต้องการรถอเนกประสงค์พร้อมภาพลักษณ์สปอร์ต",
    sellerName: "Zed Premium Chiang Mai"
  },
  {
    slug: "2023-audi-q5-sportback-quattro",
    name: "Audi Q5 Sportback quattro",
    year: "2023",
    price: "฿2,490,000",
    numericPrice: 2490000,
    monthly: "฿42,900/เดือน",
    location: "กรุงเทพฯ",
    mileage: "18,000 กม.",
    fuel: "เบนซิน",
    tag: "Featured",
    tone: "success",
    category: "suv",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=82",
    gallery: createVehicleGallery(
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=82",
      interiorImages.porsche
    ),
    transmission: "S tronic 7 สปีด",
    drive: "quattro AWD",
    engine: "2.0L TFSI",
    exteriorColor: "ขาว Glacier White",
    interiorColor: "ดำ Leather",
    seats: "5 ที่นั่ง",
    owner: "เจ้าของเดิม 1 คน",
    description:
      "Q5 Sportback ไมล์น้อย ทรงสปอร์ต ออปชันครบ พร้อมระบบขับเคลื่อน quattro และแพ็กเกจช่วยเหลือผู้ขับขี่ครบชุด",
    sellerName: "Zed Auto Rama 9"
  },
  {
    slug: "2022-tesla-model-3-long-range",
    name: "Tesla Model 3 Long Range",
    year: "2022",
    price: "฿1,899,000",
    numericPrice: 1899000,
    monthly: "฿31,600/เดือน",
    location: "ปทุมธานี",
    mileage: "29,400 กม.",
    fuel: "ไฟฟ้า",
    tag: "EV Deal",
    tone: "success",
    category: "ev",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
    gallery: createVehicleGallery(
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
      interiorImages.tesla
    ),
    transmission: "Single speed",
    drive: "AWD",
    engine: "Dual motor electric",
    exteriorColor: "ขาว Pearl White",
    interiorColor: "ขาว Premium",
    seats: "5 ที่นั่ง",
    owner: "เจ้าของเดิม 1 คน",
    description:
      "รถไฟฟ้าระยะทางไกล แบตเตอรี่สุขภาพดี ระบบซอฟต์แวร์อัปเดตล่าสุด ภายในเรียบสะอาดและพร้อมใช้งานทันที",
    sellerName: "Zed EV Center"
  },
  {
    slug: "2024-byd-seal-performance-awd",
    name: "BYD Seal Performance AWD",
    year: "2024",
    price: "฿1,329,000",
    numericPrice: 1329000,
    monthly: "฿22,300/เดือน",
    location: "ชลบุรี",
    mileage: "8,600 กม.",
    fuel: "ไฟฟ้า",
    tag: "Low mile",
    tone: "success",
    category: "ev",
    image:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
    gallery: createVehicleGallery(
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
      interiorImages.tesla
    ),
    transmission: "Single speed",
    drive: "AWD",
    engine: "Dual motor electric",
    exteriorColor: "น้ำเงิน Atlantis Grey",
    interiorColor: "ดำ",
    seats: "5 ที่นั่ง",
    owner: "เจ้าของเดิม 1 คน",
    description:
      "รถไฟฟ้าสมรรถนะสูง ไมล์น้อยมาก อัตราเร่งดี ภายในกว้างและยังอยู่ในสภาพใกล้เคียงรถใหม่",
    sellerName: "Zed EV Chonburi"
  },
  {
    slug: "2023-toyota-hilux-revo-rocco",
    name: "Toyota Hilux Revo Rocco",
    year: "2023",
    price: "฿879,000",
    numericPrice: 879000,
    monthly: "฿15,200/เดือน",
    location: "ขอนแก่น",
    mileage: "21,700 กม.",
    fuel: "ดีเซล",
    tag: "Ready",
    tone: "warning",
    category: "pickup",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    gallery: createVehicleGallery(
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      interiorImages.truck
    ),
    transmission: "อัตโนมัติ 6 สปีด",
    drive: "4WD",
    engine: "2.8L Diesel Turbo",
    exteriorColor: "เทา Graphite",
    interiorColor: "ดำ",
    seats: "5 ที่นั่ง",
    owner: "เจ้าของเดิม 1 คน",
    description:
      "กระบะตัวท็อปพร้อมใช้งาน ช่วงล่างดี เครื่องแน่น เหมาะทั้งใช้งานธุรกิจและเดินทางต่างจังหวัด",
    sellerName: "Zed Truck Khon Kaen"
  },
  {
    slug: "2022-ford-ranger-wildtrak",
    name: "Ford Ranger Wildtrak",
    year: "2022",
    price: "฿949,000",
    numericPrice: 949000,
    monthly: "฿16,800/เดือน",
    location: "ระยอง",
    mileage: "37,900 กม.",
    fuel: "ดีเซล",
    tag: "Popular",
    tone: "success",
    category: "pickup",
    image:
      "https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?auto=format&fit=crop&w=1200&q=80",
    gallery: createVehicleGallery(
      "https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?auto=format&fit=crop&w=1200&q=80",
      interiorImages.truck
    ),
    transmission: "อัตโนมัติ 10 สปีด",
    drive: "4WD",
    engine: "2.0L Bi-Turbo Diesel",
    exteriorColor: "ส้ม Saber",
    interiorColor: "ดำ",
    seats: "5 ที่นั่ง",
    owner: "เจ้าของเดิม 1 คน",
    description:
      "Wildtrak ออปชันแน่น กล้องรอบคัน ระบบความปลอดภัยครบ ตัวถังสวยและพร้อมจัดไฟแนนซ์",
    sellerName: "Zed Truck Rayong"
  },
  {
    slug: "2023-lexus-rx-350h-luxury",
    name: "Lexus RX 350h Luxury",
    year: "2023",
    price: "฿3,790,000",
    numericPrice: 3790000,
    monthly: "฿62,400/เดือน",
    location: "กรุงเทพฯ",
    mileage: "13,500 กม.",
    fuel: "ไฮบริด",
    tag: "Premium",
    tone: "success",
    category: "luxury",
    image:
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80",
    gallery: createVehicleGallery(
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80",
      interiorImages.mercedes
    ),
    transmission: "E-CVT",
    drive: "AWD",
    engine: "2.5L Hybrid",
    exteriorColor: "เงิน Sonic Titanium",
    interiorColor: "น้ำตาล Semi-aniline",
    seats: "5 ที่นั่ง",
    owner: "เจ้าของเดิม 1 คน",
    description:
      "SUV หรูขับสบาย เงียบ ประหยัด และงานประกอบพรีเมียม เหมาะกับผู้บริหารหรือครอบครัวที่ต้องการความนุ่มนวล",
    sellerName: "Zed Luxury Bangkok"
  },
  {
    slug: "2021-porsche-taycan-4s",
    name: "Porsche Taycan 4S",
    year: "2021",
    price: "฿5,590,000",
    numericPrice: 5590000,
    monthly: "฿91,500/เดือน",
    location: "ภูเก็ต",
    mileage: "24,200 กม.",
    fuel: "ไฟฟ้า",
    tag: "Luxury EV",
    tone: "warning",
    category: "luxury",
    image:
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
    gallery: createVehicleGallery(
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
      interiorImages.porsche
    ),
    transmission: "2-speed EV",
    drive: "AWD",
    engine: "Dual motor electric",
    exteriorColor: "ดำ Volcano Grey",
    interiorColor: "ดำ Race-Tex",
    seats: "4 ที่นั่ง",
    owner: "เจ้าของเดิม 1 คน",
    description:
      "สปอร์ตไฟฟ้าระดับเรือธง สมรรถนะสูง ช่วงล่างแน่น ภายในพรีเมียม และมีประวัติดูแลครบ",
    sellerName: "Zed Luxury Phuket"
  }
];

export const carCategories = [
  {
    slug: "all",
    title: "รวมรถทุกประเภท",
    description: "ดูรถมือสองทั้งหมดที่ผ่านการคัดเกรดจาก Zed Auto",
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "suv",
    title: "SUV",
    description: "รถอเนกประสงค์ นั่งสบาย พื้นที่เยอะ เหมาะกับครอบครัว",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "sedan",
    title: "Sedan",
    description: "รถซีดานพรีเมียม ขับนุ่ม ประหยัด และดูเป็นมืออาชีพ",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "ev",
    title: "EV",
    description: "รถไฟฟ้าไมล์สวย ค่าใช้จ่ายต่ำ เทคโนโลยีทันสมัย",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "pickup",
    title: "Pickup",
    description: "รถกระบะพร้อมใช้งาน งานหนัก เดินทางไกล หรือใช้ธุรกิจ",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "luxury",
    title: "Luxury",
    description: "รถหรูคัดพิเศษ ประวัติชัด พร้อมบริการดูแลระดับพรีเมียม",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
  }
] as const satisfies ReadonlyArray<CarCategory>;

export function getVehiclesByCategory(category: CarCategorySlug) {
  if (category === "all") {
    return vehicles;
  }

  return vehicles.filter((vehicle) => vehicle.category === category);
}

export function getCategoryCount(category: CarCategorySlug) {
  return getVehiclesByCategory(category).length;
}

export function getVehicleBySlug(slug: string) {
  return vehicles.find((vehicle) => vehicle.slug === slug);
}

export function getRelatedVehicles(vehicle: Vehicle, limit = 3) {
  return vehicles
    .filter(
      (candidate) =>
        candidate.category === vehicle.category && candidate.slug !== vehicle.slug
    )
    .slice(0, limit);
}
