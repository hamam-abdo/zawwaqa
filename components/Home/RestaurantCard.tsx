"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Heart,
  MessageCircle,
  MapPin,
  LoaderCircle,
  SquarePen,
  Trash2,
} from "lucide-react";
import { TRestaurant } from "@/types/shared";
import { formatNotificationDate } from "../formatDistance";
import useHome from "@/hooks/useHome";
import DeleteRestaurant from "../DeleteRestaurant";
import { useState } from "react";
import AddRestaurant from "../AddRestaurant";
import useHeader from "@/hooks/useHeader";

export default function RestaurantCard({
  Restaurants,
  isOwner,
}: {
  Restaurants: TRestaurant;
  isOwner?: boolean;
}) {
  const { handleToggleLove, loadingId, favorite } = useHome([]);
  const { open, toggleMenu2 } = useHeader();
  const r = Restaurants; // ← حتى لا نغيّر أي شيء عندك
  const [open2, setOpen] = useState(false);
  const renderStars = (rating: number) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < Math.floor(rating)
            ? "fill-amber-400 text-amber-400"
            : "text-gray-300"
        }
      />
    ));

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* IMAGE */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden rounded-t-2xl">
        <Image
          src={r.image_url}
          alt={r.name}
          fill
          sizes="(max-width: 768px) 100vw, 
         (max-width: 1200px) 50vw, 
         33vw"
          priority
          className="object-cover transition-transform duration-500 hover:scale-105"
        />

        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
          <span className="font-bold text-gray-800">{r.rating}</span>
          <Star size={14} className="fill-amber-400 text-amber-400" />
        </div>

        <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
          {r.category}
        </div>
      </div>

      {/* USER INFO */}
      <div className="flex items-center gap-3 p-5 pt-4 pb-0">
        <Image
          src={r.user.img}
          alt={r.user.name}
          width={35}
          height={35}
          className="w-10 h-10 rounded-full object-cover border"
        />

        <div>
          <Link
            href={`/profile/${r.user.public_id}`}
            className="text-sm font-semibold text-gray-800 hover:text-orange-500 transition-colors block"
          >
            {r.user.name}
          </Link>

          <span className="text-xs text-gray-500">
            {formatNotificationDate(new Date(r.created_at))}
          </span>
        </div>
      </div>

      {/* DETAILS */}
      <div className="p-5 pt-3">
        <Link
          href={`/restaurant/${r.id}`}
          className="text-xl font-bold text-gray-800 cursor-pointer mb-2 block"
        >
          {r.name}
        </Link>

        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              r.address
            )}`}
            target="_blank"
            className="relative group"
          >
            <MapPin size={16} className="text-orange-500" />
            <span className="absolute bottom-full mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
              افتح على Google Maps
            </span>
          </a>
          <span className="text-sm">{r.city}</span>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex gap-4">
            <button
              onClick={() => handleToggleLove(r.id)}
              className="flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-red-500 transition-all"
            >
              {loadingId === r.id ? (
                <LoaderCircle size={14} className="animate-spin" />
              ) : (
                <>
                  <Heart
                    size={18}
                    className={
                      favorite.includes(Number(r.id))
                        ? "fill-red-500 text-red-500"
                        : "text-red-400"
                    }
                  />
                  <span className="text-sm font-medium">{r.love_count}</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 text-gray-600">
              <MessageCircle size={18} className="text-blue-400" />
              <span className="text-sm font-medium">{r.comment_count}</span>
            </div>
          </div>
          {isOwner ? (
            <div className="flex gap-2">
              <button
                onClick={toggleMenu2}
                className=" cursor-pointer text-orange-600"
              >
                <SquarePen size={16} />
              </button>
              {open && (
                <AddRestaurant
                  open={open}
                  toggleMenu2={toggleMenu2}
                  Restaurant={r}
                />
              )}
              <button
                onClick={() => setOpen(true)}
                className="cursor-pointer  text-red-600  "
              >
                <Trash2 size={16} />
              </button>
              {open2 && (
                <DeleteRestaurant
                  open={open2}
                  toggleMenu2={() => setOpen(!open2)}
                  id={r.id}
                  image={r.image_url}
                />
              )}
            </div>
          ) : (
            <div className="flex">{renderStars(r.rating)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
