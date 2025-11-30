import NotFound from "@/app/not-found";
import ProfileClient from "./ProfileClient";
import { createSupabaseServerClient } from "@/utils/supabase/server";

import getRestaurant from "@/components/Server/getRestaurant";
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createSupabaseServerClient();
  // جلب بيانات اليوزر
  const { data: profile } = await supabase
    .from("user")
    .select("*")
    .eq("public_id", resolvedParams.id)
    .single();

  if (!profile) return NotFound();
  // جلب المطاعم المرتبطة باليوزر

  const restaurants = await getRestaurant(undefined, profile?.id);
  // جلب الإشعارات المرتبطة باليوزر
  const { data: notifications } = await supabase
    .from("notifications")
    .select("type")
    .eq("user_id", profile?.id);

  // جمع البيانات
  const restaurants_count = restaurants?.length || 0;
  const love_count =
    notifications?.filter((n) => n.type === "love").length || 0;
  const comment_count =
    notifications?.filter((n) => n.type === "comment").length || 0;

  // دمج كل شيء في كائن واحد
  const userProfile = {
    ...profile,
    restaurants_count,
    love_count,
    comment_count,
    restaurants,
  };

  return <ProfileClient id={resolvedParams.id} profile={userProfile} />;
}
