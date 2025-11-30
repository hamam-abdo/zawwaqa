import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * 🔒 middleware لتحديث جلسة Supabase إذا اقتربت من الانتهاء.
 * - يُستخدم عادة داخل /middleware.ts أو كـ util في خوادمك.
 * - لا تستخدم Redux أو store هنا، لأن الكود يعمل على السيرفر.
 * - يتم تجديد الكوكيز تلقائيًا عند الحاجة.
 */

export async function updateSession(request: NextRequest) {
  // نبدأ برد افتراضي
  const response = NextResponse.next({ request });

  try {
    // إنشاء عميل Supabase من جانب السيرفر
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          // جلب كل الكوكيز الموجودة في الطلب
          getAll() {
            return request.cookies.getAll();
          },
          // عند تحديث الجلسة، يطلب Supabase تحديث الكوكيز
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // جلب الجلسة الحالية
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("❌ فشل في جلب الجلسة:", error.message);
      return response;
    }

    // التحقق من وقت انتهاء الجلسة
    const currentTime = Math.floor(Date.now() / 1000);
    if (session && session.expires_at && session.expires_at <= currentTime + 60) {
      console.log("🔁 يتم تحديث الجلسة لأن صلاحيتها أوشكت على الانتهاء...");

      const { data: refreshed, error: refreshError } =
        await supabase.auth.refreshSession();

      if (refreshError) {
        console.error("❌ فشل تحديث الجلسة:", refreshError.message);

        // توجيه المستخدم لتسجيل الدخول من جديد
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }

      // تعيين الكوكيز الجديدة إن وجدت
      if (refreshed.session) {
        const { access_token, refresh_token, expires_at } = refreshed.session;
        const maxAge =    expires_at ? expires_at - currentTime : 3600;

        // كوكيز الوصول
        response.cookies.set("sb-access-token", access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge,
        });

        // كوكيز التحديث
        if (refresh_token) {
          response.cookies.set("sb-refresh-token", refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // أسبوع مثلاً
          });
        }
      }
    }

    return response;
  } catch (err) {
    console.error("⚠️ خطأ غير متوقع في updateSession:", err);
    return response;
  }
}
