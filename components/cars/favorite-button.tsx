"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { getStoredAccessToken } from "@/lib/auth-storage";
import { addFavorite, removeFavorite } from "@/lib/client-api";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  vehicleId?: string;
  vehicleName: string;
};

export function FavoriteButton({ vehicleId, vehicleName }: FavoriteButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const disabled = useMemo(() => !vehicleId, [vehicleId]);

  function handleClick() {
    if (!vehicleId) {
      setError("รายการนี้ยังไม่เชื่อมกับ backend");
      return;
    }

    const token = getStoredAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        if (saved) {
          await removeFavorite(vehicleId, token);
          setSaved(false);
          return;
        }

        await addFavorite(vehicleId, token);
        setSaved(true);
      } catch (submissionError) {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : `ไม่สามารถบันทึก ${vehicleName} ได้`
        );
      }
    });
  }

  return (
    <>
      <Button
        aria-label={`บันทึก ${vehicleName}`}
        className={cn(
          "absolute right-3 top-3 bg-white/88 text-zinc-950 hover:bg-white",
          saved && "text-rose-600"
        )}
        disabled={disabled || isPending}
        onClick={handleClick}
        size="icon"
        type="button"
        variant="ghost"
      >
        <Heart className={cn(saved && "fill-current")} />
      </Button>
      {error ? (
        <p className="px-4 text-xs text-rose-600">{error}</p>
      ) : null}
    </>
  );
}

