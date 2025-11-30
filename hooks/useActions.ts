"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addLove, removeLove } from "@/store/loves/Slice";
import { addcomment, removecomment } from "@/store/comment/Slice";
import { createClient } from "@/utils/supabase/client";
import { getClientSession } from "@/utils/supabase/getClientSession";

export default function useActions() {
  const router = useRouter();
  const dispatch = useDispatch();
  const supabase = createClient();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function toggleLove(restaurantId: number, currentlyLoved: boolean) {
    const session = await getClientSession();
    if (!session) return router.push("/login");
    if (loadingId === restaurantId) return;
    setLoadingId(restaurantId);

    try {
      const userId = session.user.id;

      if (currentlyLoved) {
        await supabase
          .from("loves")
          .delete()
          .eq("user_id", userId)
          .eq("restaurant_id", restaurantId);
        dispatch(removeLove(restaurantId));
        return false; // لم يعد في المفضلة
      } else {
        await supabase.from("loves").insert({
          user_id: userId,
          restaurant_id: restaurantId,
        });
        dispatch(addLove(restaurantId));
        return true; // أصبح في المفضلة
      }
    } finally {
      setLoadingId(null);
    }
  }
  async function toggleComment(
    restaurantId: number,
    currentlyComment: boolean,
    id_notifi?: string,
    comment?: string,
    rating?: number
  ) {
    const session = await getClientSession();
    if (!session) return router.push("/login");

    try {
      const userId = session.user.id;

      if (currentlyComment) {
        await supabase.from("notifications").delete().eq("id", id_notifi);
        if (id_notifi) dispatch(removecomment(id_notifi));
        return false; // لم يعد في المفضلة
      } else {
        const { data } = await supabase
          .from("notifications")
          .insert({
            user_id: userId,
            restaurant_id: restaurantId,
            comment,
            rating: Number(rating),
            type: "comment",
          })
          .select(
            `
        id, comment, rating, created_at, type , 
        user:user_id ( id, name, img, public_id )
        `
          )
          .single();

        if (!data) return;

        // إصلاح user[]
        const fixedData = {
          ...data,
          restaurant_id: restaurantId,
          user: Array.isArray(data.user) ? data.user[0] : data.user,
        };

        dispatch(addcomment(fixedData));
        return true; // أصبح في المفضلة
      }
    } finally {
    }
  }

  return { toggleLove, toggleComment, loadingId };
}
