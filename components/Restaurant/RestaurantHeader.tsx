"use client";

import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import { TRestaurant } from "@/types/shared";
import { formatNotificationDate } from "@/components/formatDistance";
import Link from "next/link";

export default function RestaurantHeader({
  storeRestaurant,
}: {
  storeRestaurant: TRestaurant;
}) {
  return (
    <>
      <div className="relative h-[60dvh]">
        <Image
          src={storeRestaurant.image_url}
          alt={storeRestaurant.name || "صورة المطعم"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 
         (max-width: 1200px) 50vw, 
         33vw"
          priority
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>

        <div className="absolute bottom-0 right-0 left-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-orange-500 px-4 py-1.5 rounded-full text-sm font-medium">
                    {storeRestaurant.category}
                  </span>

                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="font-bold">{storeRestaurant.rating}</span>
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  {storeRestaurant.name}
                </h1>

                <div className="flex items-center gap-2 text-lg">
                  <MapPin size={20} />
                  <span>{storeRestaurant.city}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* بيانات المستخدم */}
      <div className="container mx-auto">
        <div className="px-4 mt-6 flex items-center gap-4 bg-white rounded-2xl p-4 shadow-md">
          <div className="w-18 h-18 relative rounded-full overflow-hidden">
            <Image
              src={storeRestaurant.user.img}
              alt={storeRestaurant.user.name}
              fill
              sizes="(max-width: 768px) 100vw, 
         (max-width: 1200px) 50vw, 
         33vw"
              priority
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Link
              href={`/profile/${storeRestaurant.user.public_id}`}
              className="text-lg md:text-xl font-semibold  text-gray-800 hover:text-orange-500 transition-colors"
            >
              {storeRestaurant.user.name}
            </Link>

            <span className="text-sm text-gray-500">
              {formatNotificationDate(new Date(storeRestaurant.created_at))}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
