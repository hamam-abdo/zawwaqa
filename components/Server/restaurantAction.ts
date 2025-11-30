import { createClient } from "@/utils/supabase/client";
import { getClientSession } from "@/utils/supabase/getClientSession";

const normalizeCity = (city: string) => {
  city = city.trim().toLowerCase(); // إزالة الفراغات وتحويل للحروف الصغيرة
  const lastChar = city.slice(-1); // آخر حرف
  const normalizedLastChar = lastChar
    .replace(/[إأآ]/, "ا") // توحيد الألف فقط إذا كانت آخر حرف
    .replace(/ه/, "ة") // توحيد التاء المربوطة
    .replace(/ى/, "ي"); // توحيد الياء
  return city.slice(0, -1) + normalizedLastChar; // إعادة تكوين الكلمة
};

export async function RestaurantAction(
  formData: FormData,
  type: "add" | "edit",
  id?: number
) {
  const supabase = createClient();
  const name = formData.get("name") as string;
  const city = formData.get("city") as string;
  const category = formData.get("cat") as string;
  const description = formData.get("desc") as string;
  const address = formData.get("address") as string;
  const rating = Number(formData.get("rating"));
  const image = formData.get("img") as File;
  const imageUrl = formData.get("imageUrl") as string;

  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));

  const session = await getClientSession();
  if (!session) return null;
  const userId = session.user.id;
  const normalizedCity = normalizeCity(city);

  const fileName = `${Date.now()}_${image.name}`;

  if (type == "edit") {
    let newImageUrl = imageUrl;
    if (image && image.size > 0) {
      const removeimage = decodeURIComponent(imageUrl.split("/").pop()!);
      await supabase.storage.from("Restaurant").remove([removeimage]);
      await supabase.storage.from("Restaurant").upload(fileName, image, {
        cacheControl: "3600",
        upsert: false,
      });
      const { data: publicUrlData } = supabase.storage
        .from("Restaurant")
        .getPublicUrl(fileName);

      newImageUrl = publicUrlData?.publicUrl;
    }
     await supabase
      .from("restaurants")
      .update({
        name,
        city: normalizedCity,
        category,
        description,
        rating,
        image_url: newImageUrl,
        address,
        lat,
        lng,
      })
      .eq("id", id);
    return;
  }

  // رفع الصورة
  const { error: uploadError } = await supabase.storage
    .from("Restaurant")
    .upload(fileName, image);

  if (uploadError) {
    console.error("Error uploading file:", uploadError.message);
    return;
  }

  // الحصول على رابط الصورة العام
  const { data: publicUrlData } = supabase.storage
    .from("Restaurant")
    .getPublicUrl(fileName);

  const image_url = publicUrlData?.publicUrl;

  // إدخال بيانات المطعم في قاعدة البيانات
  const { error } = await supabase.from("restaurants").insert({
    name,
    city: normalizedCity,
    category,
    description,
    rating,
    image_url,
    address,
    lat,
    lng,
    user_id: userId,
  });
  return error?.message;
}
