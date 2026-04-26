"use client";

/* eslint-disable @next/next/no-img-element */
import {
  Armchair,
  BatteryCharging,
  Calendar,
  CarFront,
  Fuel,
  Gauge,
  ImagePlus,
  MapPin,
  Paintbrush,
  Route,
  Settings2,
  Tag,
  Trash2,
  UploadCloud,
  UserRound
} from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getStoredAccessToken } from "@/lib/auth-storage";
import { submitSellerVehicle } from "@/lib/client-api";
import { cn } from "@/lib/utils";

const MAX_IMAGES = 7;

type ImagePreview = {
  id: string;
  name: string;
  url: string;
};

type FormState = {
  brand: string;
  model: string;
  year: string;
  priceTHB: string;
  location: string;
  mileageKM: string;
  transmission: string;
  fuelType: string;
  driveTrain: string;
  engine: string;
  exteriorColor: string;
  interiorColor: string;
  ownerSummary: string;
  sellerName: string;
  phone: string;
  email: string;
  description: string;
};

const initialFormState: FormState = {
  brand: "",
  model: "",
  year: "",
  priceTHB: "",
  location: "",
  mileageKM: "",
  transmission: "",
  fuelType: "",
  driveTrain: "",
  engine: "",
  exteriorColor: "",
  interiorColor: "",
  ownerSummary: "",
  sellerName: "",
  phone: "",
  email: "",
  description: ""
};

const detailFields = [
  {
    icon: Gauge,
    label: "เลขไมล์",
    key: "mileageKM",
    placeholder: "เช่น 51,200 กม."
  },
  {
    icon: Settings2,
    label: "เกียร์",
    key: "transmission",
    placeholder: "เช่น PDK 7 สปีด"
  },
  {
    icon: Fuel,
    label: "เชื้อเพลิง",
    key: "fuelType",
    placeholder: "เช่น เบนซิน"
  },
  {
    icon: Route,
    label: "ระบบขับเคลื่อน",
    key: "driveTrain",
    placeholder: "เช่น AWD"
  },
  {
    icon: BatteryCharging,
    label: "เครื่องยนต์",
    key: "engine",
    placeholder: "เช่น 2.0L Turbo"
  },
  {
    icon: Paintbrush,
    label: "สีภายนอก",
    key: "exteriorColor",
    placeholder: "เช่น Jet Black"
  },
  {
    icon: Armchair,
    label: "ภายใน",
    key: "interiorColor",
    placeholder: "เช่น Leather"
  },
  {
    icon: UserRound,
    label: "เป็นรถมือ 1 หรือรถมือ 2",
    key: "ownerSummary",
    placeholder: "เช่น รถมือ 1 หรือ รถมือ 2"
  }
] as const;

const basicFields = [
  { icon: CarFront, label: "ยี่ห้อ", key: "brand", placeholder: "เช่น BMW" },
  { icon: Tag, label: "รุ่น", key: "model", placeholder: "เช่น 320d M Sport" },
  { icon: Calendar, label: "ปีรถ", key: "year", placeholder: "เช่น 2022" },
  { icon: Tag, label: "ราคาที่ต้องการ", key: "priceTHB", placeholder: "เช่น 1,689,000" },
  { icon: MapPin, label: "พื้นที่รถ", key: "location", placeholder: "เช่น กรุงเทพฯ" }
] as const;

function formatValue(value: string, fallback: string) {
  return value.trim() || fallback;
}

function parsePositiveNumber(value: string) {
  const normalized = value.replace(/[^\d]/g, "");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function SellCarForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const carTitle = useMemo(() => {
    const title = [form.year, form.brand, form.model]
      .map((item) => item.trim())
      .filter(Boolean)
      .join(" ");

    return title || "รถของคุณ";
  }, [form.brand, form.model, form.year]);

  function updateField(key: keyof FormState, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value
    }));
  }

  function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    setErrorMessage("");

    setImages((currentImages) => {
      const availableSlots = MAX_IMAGES - currentImages.length;
      const selectedFiles = files.slice(0, availableSlots);

      if (files.length > availableSlots) {
        setErrorMessage(`เพิ่มรูปได้สูงสุด ${MAX_IMAGES} รูป`);
      }

      const nextImages = selectedFiles.map((file) => ({
        id: `${file.name}-${crypto.randomUUID()}`,
        name: file.name,
        url: URL.createObjectURL(file)
      }));

      return [...currentImages, ...nextImages];
    });
  }

  function removeImage(imageId: string) {
    setImages((currentImages) => {
      const imageToRemove = currentImages.find((image) => image.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }

      return currentImages.filter((image) => image.id !== imageId);
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const year = parsePositiveNumber(form.year);
    const priceTHB = parsePositiveNumber(form.priceTHB);
    const mileageKM = parsePositiveNumber(form.mileageKM);

    if (!form.brand.trim() || !form.model.trim() || !form.year.trim()) {
      setErrorMessage("กรุณากรอกยี่ห้อ รุ่น และปีรถให้ครบ");
      return;
    }

    if (!year || !priceTHB || !form.location.trim() || !mileageKM) {
      setErrorMessage("กรุณากรอกปีรถ ราคา พื้นที่รถ และเลขไมล์ให้ครบ");
      return;
    }

    if (!form.sellerName.trim() || !form.phone.trim() || !form.email.trim()) {
      setErrorMessage("กรุณากรอกชื่อผู้ขาย เบอร์โทร และอีเมลให้ครบ");
      return;
    }

    if (images.length === 0) {
      setErrorMessage("กรุณาเพิ่มรูปภาพรถอย่างน้อย 1 รูป");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitSellerVehicle(getStoredAccessToken(), {
        brand: form.brand,
        model: form.model,
        year,
        priceTHB,
        location: form.location,
        mileageKM,
        transmission: form.transmission,
        fuelType: form.fuelType,
        driveTrain: form.driveTrain,
        engine: form.engine,
        exteriorColor: form.exteriorColor,
        interiorColor: form.interiorColor,
        ownerSummary: form.ownerSummary,
        sellerName: form.sellerName,
        phone: form.phone,
        email: form.email,
        description: form.description,
        imageNames: images.map((image) => image.name)
      });

      images.forEach((image) => URL.revokeObjectURL(image.url));
      setImages([]);
      setForm(initialFormState);
      setSuccessMessage(`ส่งข้อมูลรถเข้าฐานข้อมูลแล้ว เลขอ้างอิง ${response.id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "ไม่สามารถส่งข้อมูลรถเข้าระบบได้ในตอนนี้"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="container pb-12 lg:pb-16">
      <form className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">ข้อมูลรถเบื้องต้น</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {basicFields.map((field) => (
                <TextField
                  icon={field.icon}
                  key={field.key}
                  label={field.label}
                  onChange={(value) => updateField(field.key, value)}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                />
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">รายละเอียดรถ</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {detailFields.map((field) => (
                <TextField
                  icon={field.icon}
                  key={field.key}
                  label={field.label}
                  onChange={(value) => updateField(field.key, value)}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                />
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">รูปภาพรถ</CardTitle>
              <p className="text-sm text-muted-foreground">
                เพิ่มรูปภาพประกอบได้สูงสุด {MAX_IMAGES} รูป แนะนำให้มีภาพภายนอก ภายใน หน้าปัด และเลขไมล์
              </p>
            </CardHeader>
            <CardContent>
              <label
                className={cn(
                  "flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-center transition hover:border-emerald-500 hover:bg-emerald-50/60",
                  images.length >= MAX_IMAGES && "pointer-events-none opacity-55"
                )}
              >
                <UploadCloud className="h-9 w-9 text-emerald-600" />
                <span className="mt-3 text-sm font-semibold text-zinc-950">
                  เลือกรูปภาพรถ
                </span>
                <span className="mt-1 text-sm text-zinc-500">
                  {images.length}/{MAX_IMAGES} รูป
                </span>
                <input
                  accept="image/*"
                  className="sr-only"
                  multiple
                  onChange={handleImagesChange}
                  type="file"
                />
              </label>

              {images.length > 0 ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((image, index) => (
                    <div
                      className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100"
                      key={image.id}
                    >
                      <img
                        alt={`${carTitle} รูปที่ ${index + 1}`}
                        className="h-full w-full object-cover"
                        src={image.url}
                      />
                      <button
                        aria-label={`ลบรูปที่ ${index + 1}`}
                        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-md bg-white/90 text-zinc-950 shadow-line transition hover:bg-red-50 hover:text-red-600"
                        onClick={() => removeImage(image.id)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">ข้อมูลผู้ขาย</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <TextField
                icon={UserRound}
                label="ชื่อผู้ขาย"
                onChange={(value) => updateField("sellerName", value)}
                placeholder="ชื่อ - นามสกุล"
                value={form.sellerName}
              />
              <TextField
                icon={Tag}
                label="เบอร์โทร"
                onChange={(value) => updateField("phone", value)}
                placeholder="เช่น 08x-xxx-xxxx"
                value={form.phone}
              />
              <TextField
                icon={Tag}
                label="อีเมล"
                onChange={(value) => updateField("email", value)}
                placeholder="you@example.com"
                value={form.email}
              />
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-zinc-700" htmlFor="description">
                  รายละเอียดเพิ่มเติม
                </label>
                <textarea
                  className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  id="description"
                  onChange={(event) => updateField("description", event.target.value)}
                  placeholder="เล่าประวัติการใช้งาน จุดเด่น อุปกรณ์เสริม หรือข้อมูลที่อยากให้ผู้ซื้อทราบ"
                  value={form.description}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="sticky top-24 bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">ตัวอย่างประกาศ</CardTitle>
              <p className="text-sm text-muted-foreground">
                ข้อมูลนี้จะช่วยให้ทีมงานตรวจประกาศได้เร็วขึ้น
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                {images[0] ? (
                  <img
                    alt={carTitle}
                    className="aspect-[16/10] w-full object-cover"
                    src={images[0].url}
                  />
                ) : (
                  <div className="flex aspect-[16/10] flex-col items-center justify-center text-zinc-500">
                    <ImagePlus className="h-9 w-9" />
                    <p className="mt-2 text-sm">ยังไม่มีรูปภาพ</p>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-semibold tracking-normal text-zinc-950">
                  {carTitle}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatValue(form.location, "พื้นที่รถ")}
                </p>
                <p className="mt-4 text-2xl font-semibold">
                  {formatValue(form.priceTHB, "ราคาที่ต้องการ")}
                </p>
              </div>

              <div className="grid gap-3">
                {detailFields.map((field) => {
                  const Icon = field.icon;
                  const value = form[field.key];

                  return (
                    <div className="flex items-center gap-3" key={field.key}>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-950">
                          {formatValue(value, field.placeholder.replace("เช่น ", ""))}
                        </p>
                        <p className="text-xs text-muted-foreground">{field.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {errorMessage ? (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {errorMessage}
                </p>
              ) : null}

              {successMessage ? (
                <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {successMessage}
                </p>
              ) : null}

              <Button
                className="h-12 w-full text-base"
                disabled={isSubmitting}
                type="submit"
                variant="premium"
              >
                {isSubmitting ? "กำลังส่งข้อมูล..." : "ส่งข้อมูลเพื่อลงขายรถ"}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </form>
    </section>
  );
}

function TextField({
  icon: Icon,
  label,
  onChange,
  placeholder,
  value
}: {
  icon: typeof Gauge;
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
