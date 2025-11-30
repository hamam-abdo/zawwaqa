import { createSupabaseServerClient } from "@/utils/supabase/server";

// نوع مُستخرج من Supabase مباشرة
type TNotification = { restaurant_id: string; type: "love" | "comment" };

export default async function getRestaurant(id?: string, userId?: string) {
  const supabase = await createSupabaseServerClient();

  // بناء الاستعلام
  let query = supabase
    .from("restaurants")
    .select(
      `
      *,
      user:user_id ( name, img , public_id),
     notifications:notifications (
      *,
      user:user_id ( id, name, img, public_id )
    )
      `
    )
    .order("created_at", { ascending: false });

  // إذا تم تمرير id → جلب مطعم واحد فقط
  if (id) {
    query = query.eq("id", id).limit(1);
  }
   if (userId) {
    query = query.eq("user_id", userId);
  }


  const { data, error } = await query;

  if (error || !data) return id ? null : [];

  // حساب الإعجابات والتعليقات
  const restaurantsWithCounts = data.map((r) => {
    const notifications = (r.notifications as TNotification[]) || [];

    const love_count = notifications.filter((n) => n.type === "love").length;
    const comment_count = notifications.filter(
      (n) => n.type === "comment"
    ).length;

    return {
      ...r,
      love_count,
      comment_count,
    };
  });
  if (id) return restaurantsWithCounts[0] || null;
  return restaurantsWithCounts;
}
