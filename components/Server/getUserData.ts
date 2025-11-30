// ✅ SERVER FILE — يتم تنفيذه داخل السيرفر فقط
import { createClient } from "@/utils/supabase/client";
import { getClientSession } from "@/utils/supabase/getClientSession";

export default async function getUserData() {
  const supabase = createClient();

  const session = await getClientSession();

  if (!session) return null;

  const userId = session.user.id;

  const provider = session.user.app_metadata.provider;

  // ✅ جلب بيانات اليوزر من جدول user
  const { data: userData } = await supabase
    .from("user")
    .select("*")
    .eq("id", userId)
    .single();

  // ✅ جلب مطاعم اليوزر
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("id")
    .eq("user_id", userId);

  const userRestaurantsIds = restaurants?.map((r) => r.id) || [];

  // ✅ جلب الإشعارات المرتبطة بمطاعم اليوزر
  const { data: notifications } = await supabase
    .from("notifications")
    .select(
      `
        id,
        type,
        created_at,
        comment,
        rating,
        user:user_id ( name ),
        restaurant:restaurant_id ( id ,name )
    `
    )
    .in("restaurant_id", userRestaurantsIds)
    .neq("user_id", userId) // ✅ لا يجيب الإشعارات اللي اليوزر نفسه عاملها
    .order("created_at", { ascending: false });

  // ✅ جلب المطاعم اللي اليوزر عاملها Love
  const { data: loves } = await supabase
    .from("loves")
    .select("restaurant_id")
    .eq("user_id", userId);

  const userLoves = loves?.map((l) => l.restaurant_id) || [];

  return {
    user: { ...userData, provider },
    notifications,
    userLoves,
  };
}
