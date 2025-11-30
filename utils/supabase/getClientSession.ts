import { createClient } from "./client";

export async function getClientSession() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error.message);
    return null;
  }

  return data.session;
}
