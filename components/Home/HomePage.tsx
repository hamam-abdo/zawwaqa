"use client";
import { Search, Filter } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { TRestaurant } from "@/types/shared";
import { categories } from "@/constants";
import useHome from "@/hooks/useHome";

import Restaurant from "./RestaurantCard";
export default function HomePage({
  serverRestaurants,
}: {
  serverRestaurants: TRestaurant[];
}) {
  const { restaurants, selectedCategory, handleCategoryChange } =
    useHome(serverRestaurants);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* الأقسام */}
      <div className="mb-8 categories">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-orange-600" />
          <h2 className="text-xl font-bold text-gray-800">الأقسام</h2>
        </div>

        <Swiper
          spaceBetween={25}
          slidesPerView="auto"
          className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-1 scroll-smooth whitespace-nowrap cursor-grab active:cursor-grabbing"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat} className="w-auto!">
              <button
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-orange-50 border-2 border-orange-100"
                }`}
              >
                {cat}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* المطاعم */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.length > 0 ? (
          restaurants.map((r) => {
            return <Restaurant key={r.id} Restaurants={r} />;
          })
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="inline-block p-4 bg-orange-50 rounded-full mb-4">
              <Search size={48} className="text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              لم يتم العثور على نتائج
            </h3>
            <p className="text-gray-600 mb-4">
              جرب البحث بكلمات أخرى أو اختر قسم مختلف
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
