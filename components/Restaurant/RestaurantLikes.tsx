"use client";

import { TRestaurant } from "@/types/shared";
import { Heart, LoaderCircle, MessageCircle } from "lucide-react";

export default function RestaurantLikes({
  storeRestaurant,
  favorite,
  loadingId,
  handleToggleLove,
}: {
  storeRestaurant: TRestaurant;
  favorite: number[];
  loadingId: number | null;
  handleToggleLove: (id: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">عن المطعم</h2>
      <p className="text-gray-700 leading-relaxed text-lg">
        {storeRestaurant.description}
      </p>
      <div className="flex items-center gap-4 mt-4 pt-6 border-t border-gray-100">
        <button
          onClick={() => handleToggleLove(storeRestaurant.id)}
          className={`${
            favorite.includes(Number(storeRestaurant.id))
              ? "bg-red-50 text-red-600 border-2 border-red-200"
              : " bg-gray-100 text-gray-700"
          } flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all cursor-pointer hover:bg-red-50`}
        >
          {loadingId === storeRestaurant.id ? (
            <LoaderCircle size={14} className="animate-spin" />
          ) : (
            <Heart
              size={18}
              className={
                favorite.includes(Number(storeRestaurant.id))
                  ? "fill-red-500 text-red-500"
                  : "text-red-400"
              }
            />
          )}
          <span>
            {favorite.includes(Number(storeRestaurant.id)) ? "أعجبني" : "إعجاب"}{" "}
            ({storeRestaurant.love_count})
          </span>
        </button>

        <div className="flex items-center gap-2">
          <MessageCircle size={18} className="text-blue-400" />
          <span className="text-gray-700 font-medium">
            {storeRestaurant.comment_count} تعليق
          </span>
        </div>
      </div>
    </div>
  );
}
