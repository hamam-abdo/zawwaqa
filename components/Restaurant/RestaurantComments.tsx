"use client";

import { TRestaurant } from "@/types/shared";
import { useState } from "react";
import { Ellipsis, Star } from "lucide-react";
import Image from "next/image";
import StarRating from "@/components/StarRating";
import { formatNotificationDate } from "@/components/formatDistance";

export default function RestaurantComments({
  storeRestaurant,
  comment,
  currentUserId,
  handleToggleComment,
}: {
  storeRestaurant: TRestaurant;
  comment: any[];
  currentUserId: string | null;
  handleToggleComment: (
    restaurantId: number,
    deleteComment: boolean,
    commentId?: string,
    newComment?: string,
    rating?: number
  ) => void;
}) {
  const [userComment, setUserComment] = useState("");
  const [userRating, setUserRating] = useState(1);
  const [showMenuMap, setShowMenuMap] = useState<{ [key: number]: boolean }>(
    {}
  );

  const allComments = [
    ...storeRestaurant.notifications,
    ...comment
      .filter((c) => c.restaurant_id === storeRestaurant.id)
      .filter((c) => !storeRestaurant.notifications.some((n) => n.id === c.id)),
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        التعليقات والتقييمات
      </h2>

      {/* إضافة تعليق */}
      <div className="mb-6">
        <StarRating rating={userRating} setUserRating={setUserRating} />
        <textarea
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
          placeholder="شارك تجربتك مع هذا المطعم..."
          className="w-full p-4 mt-4 border-2 border-orange-100 rounded-xl focus:outline-none focus:border-orange-300 resize-none"
          rows={3}
        ></textarea>

        <button
          disabled={!userComment.trim()}
          onClick={() => {
            handleToggleComment(
              storeRestaurant.id,
              false,
              undefined,
              userComment,
              userRating
            );
            setUserComment("");
          }}
          className={`mt-3 px-6 py-2.5 rounded-full transition-all ${
            !userComment.trim()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-linear-to-r from-orange-500 to-amber-500 cursor-pointer text-white hover:shadow-lg"
          }`}
        >
          إضافة تعليق
        </button>
      </div>

      {/* عرض التعليقات */}
      <div className="space-y-4 max-h-96 overflow-y-auto scrollbar pl-5 ">
        {allComments.map(
          (notification) =>
            notification.type === "comment" && (
              <div
                key={notification.id}
                className="border-b border-gray-100 pb-4 last:border-0 group relative"
              >
                <div className="flex   max-[450px]:flex-col gap-5 justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Image
                      src={notification.user.img}
                      alt={notification.user.name}
                      width={50}
                      height={50}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div>
                      <p className="font-bold text-gray-800">
                        {notification.user.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatNotificationDate(
                          new Date(notification.created_at)
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < notification.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 mr-13">{notification.comment}</p>

                {currentUserId &&
                  (notification.user.id === currentUserId ||
                    storeRestaurant.user_id === currentUserId) && (
                    <button
                      onClick={() =>
                        setShowMenuMap((prev) => ({
                          ...prev,
                          [notification.id]: !prev[Number(notification.id)],
                        }))
                      }
                      className="absolute bottom-4 left-0 text-gray-500 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <Ellipsis size={20} />
                    </button>
                  )}

                {showMenuMap[Number(notification.id)] && (
                  <div className="absolute bottom-5 left-20 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10 -translate-x-1/2">
                    <button
                      onClick={() =>
                        handleToggleComment(
                          storeRestaurant.id,
                          true,
                          notification.id
                        )
                      }
                      className="w-full text-center cursor-pointer px-3 py-2 text-sm text-red-500 hover:bg-gray-100"
                    >
                      حذف
                    </button>
                  </div>
                )}
              </div>
            )
        )}
      </div>
    </div>
  );
}
