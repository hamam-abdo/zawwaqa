// app/actions/searchCities.ts
"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
function cleanServer(query: string) {
  return query
    .normalize("NFC")
    .replace(/[^a-zA-Z\u0600-\u06FF\s]/g, "")
    .trim();
}
export async function searchCities(query: string, selectedCity: string) {
  const q = cleanServer(query);
  if (!q.trim() || q.length < 2) return undefined;

  const supabase = await createSupabaseServerClient();
  let request = supabase
    .from("restaurants")
    .select("id, name ,category")
    .or(`name.ilike.%${q}%,category.ilike.%${q}%`)
    .limit(50);

  if (selectedCity !== "الكل") request = request.eq("city", selectedCity);

  const { data } = await request;
  return data;
}
