"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";
import { formatNotificationDate } from "@/components/formatDistance";
import { SquarePen } from "lucide-react";
import Restaurant from "@/components/Home/RestaurantCard";
import useHome from "@/hooks/useHome";
import { useEffect, useState } from "react";
import UpdateUser from "@/components/UpdateUser";

export default function ProfileClient({
  id,
  profile,
}: {
  id: string;
  profile: any;
}) {
  const { restaurants, setRestaurants } = useHome([]);
  const restaurant = profile.restaurants;

  useEffect(() => {
    if (restaurant) {
      setRestaurants(() => [...restaurant]);
    }
  }, [restaurant, setRestaurants]);


  const user = useSelector((state: RootState) => state.user);

  const isOwner = user?.public_id === id;
  const [open, setOpen] = useState(false);
  return (
    <div className="container mx-auto  px-4 py-8 ">
      <div className=" bg-white   rounded-2xl p-8 shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row  items-center gap-6 mb-6">
          <div className="w-24 h-24 relative rounded-full overflow-hidden">
            <Image
              src={profile.img}
              alt={profile.name}
              fill
              sizes="(max-width: 768px) 100vw, 
                  (max-width: 1200px) 50vw, 
                  33vw"
              priority
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {profile.name}
            </h2>
            <p className="text-gray-600">
              {profile?.created_at &&
                "  عضو " + formatNotificationDate(new Date(profile.created_at))}
            </p>
            <div className="flex gap-6 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {profile.restaurants_count}
                </p>
                <p className="text-sm text-gray-600">مطاعم مضافة</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {profile.comment_count}
                </p>
                <p className="text-sm text-gray-600">تعليق</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {profile.love_count}
                </p>
                <p className="text-sm text-gray-600">إعجاب</p>
              </div>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={() => setOpen(true)}
              className="flex cursor-pointer items-center gap-2 bg-orange-100 text-orange-600 px-6 py-3 rounded-xl font-medium hover:bg-orange-200 transition-all"
            >
              <SquarePen size={20} />
              تعديل الملف
            </button>
          )}
          {open && (
            <UpdateUser
              open={open}
              toggleMenu2={() => setOpen(!open)}
              profile={user}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.length > 0 ? (
          restaurants.map((r) => {
            return <Restaurant key={r.id} Restaurants={r} isOwner={isOwner} />;
          })
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-gray-600 mb-4">
              {isOwner ? "لم تضف أي مطاعم بعد" : "لم يضف أي مطاعم بعد"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
