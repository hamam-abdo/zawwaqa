"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Upload } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { RestaurantAction } from "./Server/restaurantAction";
import { categories } from "@/constants";
import { useRouter } from "next/navigation";
import StarRating from "./StarRating";
import { TRestaurant } from "@/types/shared";
type Props = {
  open: boolean;
  toggleMenu2: () => void;
  Restaurant?: TRestaurant;
};
const MapPicker = dynamic(() => import("@/app/MapPicker2"), {
  ssr: false,
});

export default function AddRestaurant({
  open,
  toggleMenu2,
  Restaurant,
}: Props) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [address, setAddress] = useState(Restaurant?.address);
  const initialMarker: [number, number] | null =
    Restaurant?.lat !== undefined && Restaurant?.lng !== undefined
      ? [Restaurant?.lat, Restaurant?.lng]
      : null;
  const [marker, setMarker] = useState<[number, number] | null>(initialMarker);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userRating, setUserRating] = useState<number>(Restaurant?.rating ?? 1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString().trim();
    const city = formData.get("city")?.toString().trim();
    const cat = formData.get("cat")?.toString();
    const desc = formData.get("desc")?.toString().trim();

    if (!selectedImage && !Restaurant?.image_url) {
      setError("يرجى رفع صورة للمطعم");
      return;
    }
    if (!address) {
      setError("يرجى تحديد الموقع على الخريطة");
      return;
    }
    if (!name || !city || !cat || !desc) {
      setError("يرجى استكمل البيانات");
      return;
    }
    setIsUploading(true);

    try {
      formData.append("rating", userRating.toString());
      formData.append("address", address);
      formData.append("lat", String(marker?.[0]));
      formData.append("lng", String(marker?.[1]));
      if (selectedImage) formData.append("img", selectedImage);
      if (Restaurant) formData.append("imageUrl", Restaurant?.image_url);

      const error = await RestaurantAction(
        formData,
        Restaurant ? "edit" : "add",
        Restaurant?.id
      );
      if (error) {
        console.log(error);
        setError("المطعم موجود بالفعل");
        return;
      }
      toggleMenu2();
      router.refresh();
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent
        className="
      bg-white rounded-2xl p-4 shadow-lg border-0
      max-w-xl w-[90vw]  
      max-h-[98vh] scrollbar
       overflow-y-auto
    "
      >
        {/* ✅ Accessible Title */}
        <DialogTitle className="sr-only">أضف مطعمك المفضل</DialogTitle>

        <DialogDescription className="sr-only">
          Fixed the warning
        </DialogDescription>
        {/* ✅ Header */}
        <div className="text-center mb-2">
          <div className="inline-block p-2 bg-linear-to-br from-orange-100 to-amber-100 rounded-full mb-2">
            <Plus size={28} className="text-orange-600" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-1">
            {Restaurant ? " حديث بيانات المطعم " : " أضف مطعمك المفضل  "}
          </h2>
          <p className="text-gray-600 text-xs">شارك تجربتك مع المجتمع</p>
        </div>

        {error && (
          <div className="mb-2 text-red-500 font-semibold text-sm text-center">
            {error}
          </div>
        )}

        {/* ✅ Form */}
        <form onSubmit={handleSubmit} className="grid gap-3 ">
          {/* الاسم + المدينة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">
                اسم المطعم
              </label>
              <input
                defaultValue={Restaurant?.name}
                name="name"
                type="text"
                placeholder="أدخل اسم المطعم"
                className="w-full p-2 border border-orange-200 rounded-xl focus:outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">
                المدينة
              </label>
              <input
                defaultValue={Restaurant?.city}
                name="city"
                type="text"
                placeholder="القاهرة، الإسكندرية..."
                className="w-full p-2 border border-orange-200 rounded-xl focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>

          {/* الصورة + الوصف */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* القسم */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">
                القسم
              </label>
              <select
                name="cat"
                defaultValue={Restaurant?.category ?? ""}
                className="w-full p-2 border border-orange-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm  bg-white"
              >
                <option value="" disabled>
                  اختر القسم
                </option>
                {categories.slice(1).map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">
                الوصف
              </label>
              <textarea
                defaultValue={Restaurant?.description}
                name="desc"
                placeholder="نبذة قصيرة..."
                className="w-full p-2 border border-orange-200 rounded-xl focus:outline-none focus:border-orange-400 resize-none"
                rows={2}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="image"
              className=" 
              border border-dashed border-orange-300 rounded-xl 
              p-3 text-center bg-orange-50/40 
              cursor-pointer hover:border-orange-500 transition-all
              h-40 flex flex-col items-center justify-center 
            "
            >
              {Restaurant?.image_url || selectedImage ? (
                <Image
                  src={selectedImage ?? (Restaurant?.image_url as string)}
                  alt="Profile Preview"
                  width={400}
                  height={20}
                  className=" h-full w-full"
                />
              ) : (
                <>
                  <Upload size={40} className="mx-auto mb-1 text-orange-500" />
                  <p className="text-gray-700 text-sm">ارفع صورة</p>
                </>
              )}
            </label>

            <input
              name="img"
              type="file"
              accept="image/*"
              id="image"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* التقييم */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">
              التقييم
            </label>
            <StarRating rating={userRating} setUserRating={setUserRating} />
          </div>

          {/* الخريطة */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">
              الموقع على الخريطة
            </label>
            <MapPicker
              onChange={(data) => {
                setAddress(data.address);
                setMarker([data.lat, data.lng]);
              }}
              lat={Restaurant?.lat}
              lng={Restaurant?.lng}
            />
          </div>

          {/* الأزرار */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1  cursor-pointer bg-linear-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold hover:shadow-md transition-all"
            >
              {Restaurant
                ? isUploading
                  ? "جاري تحديث البيانات..."
                  : "تحديث البيانات"
                : isUploading
                ? "جاري الإضافة..."
                : " إضافة المطعم"}
            </button>

            <button
              type="button"
              onClick={() => toggleMenu2()}
              className="px-6 py-3 border cursor-pointer border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            >
              إلغاء
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
