"use client";
import { TRestaurant } from "@/types/shared";
import { Heart } from "lucide-react";
import useHeader from "@/hooks/useHeader"; // add this import
import Restaurant from "@/components/Home/RestaurantCard";
import { useMemo } from "react";
import Link from "next/link";
export default function Favorites({
  restaurant,
}: {
  restaurant: TRestaurant[];
}) {
  const { favorites } = useHeader();

  const favRestaurants = useMemo(() => {
    return restaurant.filter((r) => favorites.includes(Number(r.id)));
  }, [restaurant, favorites]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl my-4 mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-linear-to-br from-red-100 to-pink-100 rounded-xl">
            <Heart size={32} className="text-red-500 fill-red-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">مطاعمي المفضلة</h2>
            <p className="text-gray-600">{favorites.length} مطعم في قائمتك</p>
          </div>
        </div>
      </div>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favRestaurants.map((r) => {
            return <Restaurant key={r.id} Restaurants={r} />;
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          <div className="inline-block p-6 bg-linear-to-br from-red-50 to-pink-50 rounded-full mb-6">
            <Heart size={64} className="text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            لا توجد مطاعم مفضلة بعد
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            ابدأ باستكشاف المطاعم وأضف مطاعمك المفضلة لتجدها بسهولة لاحقاً
          </p>
          <Link
            href="/"
            className="bg-linear-to-r  from-orange-500 to-amber-500 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all font-bold"
          >
            استكشف المطاعم
          </Link>
        </div>
      )}
    </div>
  );
}
