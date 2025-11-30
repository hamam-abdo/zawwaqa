import { updateSession } from "@/utils/supabase/middleware";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  await updateSession(request);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!user && request.nextUrl.pathname === "/favorites") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
