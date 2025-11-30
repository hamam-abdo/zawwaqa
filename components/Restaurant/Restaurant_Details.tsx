"use client";

import { TRestaurant } from "@/types/shared";
import { useEffect, useState } from "react";
import useHome from "@/hooks/useHome";
import { getClientSession } from "@/utils/supabase/getClientSession";
import { MapPin } from "lucide-react";
import RestaurantHeader from "./RestaurantHeader";
import RestaurantLikes from "./RestaurantLikes";
import RestaurantComments from "./RestaurantComments";

export default function Restaurant_Details({
  restaurant,
}: {
  restaurant: TRestaurant;
}) {
  const {
    restaurants,
    handleToggleLove,
    loadingId,
    favorite,
    handleToggleComment,
    comment,
    setRestaurants,
  } = useHome([]);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    setRestaurants((prev) => {
      const idx = prev.findIndex((r) => r.id === restaurant.id);
      if (idx === -1) return [...prev, restaurant];
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...restaurant };
      return copy;
    });
  }, [restaurant, setRestaurants]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await getClientSession();
        if (!mounted) return;
        setCurrentUserId(s?.user?.id ?? null);
      } catch (e) {
        console.error("failed to get session:", e);
        if (mounted) setCurrentUserId(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const storeRestaurant =
    restaurants.find((r) => r.id === restaurant.id) || restaurant;

  return (
    <div>
      {/* Header + بيانات المستخدم */}
      <RestaurantHeader storeRestaurant={storeRestaurant} />

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* زر الإعجاب وعدد التعليقات */}
        <RestaurantLikes
          storeRestaurant={storeRestaurant}
          favorite={favorite}
          loadingId={loadingId}
          handleToggleLove={handleToggleLove}
        />

        {/* التعليقات والتقييمات */}
        <RestaurantComments
          storeRestaurant={storeRestaurant}
          comment={comment}
          currentUserId={currentUserId}
          handleToggleComment={handleToggleComment}
        />

        <div className="space-y-6">
          <div className="bg-white rounded-2xl py-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin size={24} className="text-orange-500" />
              الموقع على الخريطة
            </h3>
            <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-xl h-80 flex items-center justify-center border-2 border-orange-100 overflow-hidden">
              <iframe
                className="w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  storeRestaurant.address
                )}&hl=ar&output=embed`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
