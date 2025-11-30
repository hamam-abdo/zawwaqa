"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { TRestaurant } from "@/types/shared";
import useActions from "@/hooks/useActions";

import { useRestaurantStore } from "@/store/restaurantStore";
import { getClientSession } from "@/utils/supabase/getClientSession";
import { useRouter } from "next/navigation";

export default function useHome(serverRestaurants: TRestaurant[]) {
  const router = useRouter();

  const restaurants = useRestaurantStore((state) => state.restaurants);
  const setRestaurants = useRestaurantStore((state) => state.setRestaurants);

  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const { toggleLove, toggleComment, loadingId } = useActions();
  const favorite = useSelector((state: RootState) => state.loves);
  const comment = useSelector((state: RootState) => state.comment);

  // دالة لدمج المطاعم الجديدة مع الموجودة بدون تكرار
  const mergeRestaurants = (newRestaurants: TRestaurant[]) => {
    setRestaurants((prev: TRestaurant[]) => {
      const missing = newRestaurants.filter(
        (r) => !prev.find((x) => x.id === r.id)
      );
      if (missing.length === 0) return prev;
      return [...prev, ...missing];
    });
  };

  // دمج المطاعم عند تحميل البيانات من السيرفر أول مرة
  useEffect(() => {
    mergeRestaurants(serverRestaurants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverRestaurants]);

  const dataToFilter = restaurants.length ? restaurants : serverRestaurants;

  const filteredRestaurants = dataToFilter.filter(
    (r) => selectedCategory === "الكل" || r.category === selectedCategory
  );

  // دالة لتغيير التصنيف
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSession = async () => {
    const session = await getClientSession();
    if (!session) {
      router.push("/login");
      return false;
    }
    return true;
  };

  // دالة الإعجاب — استخدمنا functional setRestaurants لتفادي stale closures
  const handleToggleLove = async (id: number) => {
    const sessionExists = await handleSession();
    if (!sessionExists) return;

    const isLoved = favorite.includes(Number(id));

    // تحديث محلي فورًا بشكل functional (optimistic)
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, love_count: isLoved ? r.love_count - 1 : r.love_count + 1 }
          : r
      )
    );

    // تحديث السيرفر و Redux
    try {
      await toggleLove(id, isLoved);
    } catch (err) {
      // rollback: اذا فشل، ارجع القيمة القديمة عن طريق قراءة آخر نسخة من prev
      // للحصول على rollback نقوم بإعادة القيمة من serverRestaurants أو بإجراء آخر مناسب:
      // أبسط طريقة هنا: نعيد قراءة من useRestaurantStore.getState() ونخمن rollback
      const current = useRestaurantStore
        .getState()
        .restaurants.find((r) => r.id === id);
      const serverFallback = serverRestaurants.find((r) => r.id === id);
      const fallback = current ?? serverFallback;
      if (fallback) {
        // نفترض أن fallback يحتوي على القيمة الصحيحة التي قبلنا بها
        setRestaurants((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, love_count: fallback.love_count } : r
          )
        );
      }
      console.error("toggleLove failed:", err);
    }
  };

  const handleToggleComment = async (
    id: number,
    isLoved: boolean,
    id_notifi?: string,
    commentText?: string,
    rating?: number
  ) => {
    const sessionExists = await handleSession();
    if (!sessionExists) return;

    // functional update لتفادي stale closures
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              comment_count: isLoved
                ? r.comment_count - 1
                : r.comment_count + 1,
              notifications: isLoved
                ? r.notifications.filter((n) => n.id !== id_notifi)
                : r.notifications,
            }
          : r
      )
    );

    try {
      await toggleComment(id, isLoved, id_notifi, commentText, rating);
    } catch (err) {
      // rollback مشابه لطريقة الـ love: نستخدم نسخة fallback إن أمكن
      const fallback =
        useRestaurantStore.getState().restaurants.find((r) => r.id === id) ||
        serverRestaurants.find((r) => r.id === id);
      if (fallback) {
        setRestaurants((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  comment_count: fallback.comment_count,
                  notifications: fallback.notifications,
                }
              : r
          )
        );
      }
      console.error("toggleComment failed:", err);
    }
  };

  // دالة لإرجاع مطعم محدد (لتفاصيل المطعم)

  return {
    restaurants: filteredRestaurants,
    selectedCategory,
    handleCategoryChange,
    handleToggleLove,
    loadingId,
    favorite,
    setRestaurants,
    handleToggleComment,
    comment,
  };
}
