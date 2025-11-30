"use server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { getOrigin } from "@/utils/getOrigin";
import { revalidatePath } from "next/cache";
import { authErrorToArabic } from "@/utils/authErrorToArabic";
export async function OAuthSignIn(provider: Provider) {
  if (!provider) {
    return redirect("/login");
  }
  const supabase = await createSupabaseServerClient();
  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}`,
    },
  });
  if (error) {
    console.error("Error during sign in:", error.message);
    return;
  }

  return redirect(data.url);
}

export async function signup(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const origin = await getOrigin();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const avatarFile = formData.get("img") as File;

  const { data: existingUsers } = await supabase
    .from("user")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (existingUsers) {
    const msg = "  البريد الإلكتروني موجود بالفعل  ";
    redirect(`/register?message=${encodeURIComponent(msg)}`);
  }

  let avatar_url;
  let fileName;

  if (avatarFile.size == 0) {
    avatar_url =
      "https://tgickyiujjkglmzjcwqu.supabase.co/storage/v1/object/public/user_avater/user-vector.jpg";
    // الصورة الافتراضية
  } else {
    // إذا رفع المستخدم صورة، يتم رفعها إلى Supabase Storage
    fileName = `${Date.now()}_${avatarFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from("user_avater") // تأكد من صحة اسم الـ bucket
      .upload(fileName, avatarFile);

    if (uploadError) {
      console.error("Error uploading file:", uploadError.message);
      return;
    }
    const { data: publicUrlData } = supabase.storage
      .from("user_avater")
      .getPublicUrl(fileName);

    avatar_url = publicUrlData?.publicUrl;
  }
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, avatar_url }, // تخزين الاسم في metadata
    },
  });

  if (signUpError) {
    if (fileName) {
      await supabase.storage.from("user_avater").remove([fileName]);
    }
    const msg = authErrorToArabic(signUpError.message);
    redirect(`/register?message=${encodeURIComponent(msg)}`);
  }
  revalidatePath("/", "layout");
  redirect(`${origin}?welcome=bro`);
}

export async function updateUser(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const img = formData.get("img") as File;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const newPassword = formData.get("newPassword") as string;
  const public_id = formData.get("public_id") as string;
  const provider = formData.get("provider") as string;

  if (password) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      const msg =
        signInError.message == "Invalid login credentials" &&
        "  كلمة المرور غير صحيحة   ";
      return redirect(
        `/profile/${public_id}?message=${encodeURIComponent(msg)}`
      );
    }
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      const msg = authErrorToArabic(error.message);
      redirect(`/profile/${public_id}?message=${encodeURIComponent(msg)}`);
    }
  }

  if (img && img.size > 0) {
    const { data: userData } = await supabase
      .from("user")
      .select("img")
      .eq("public_id", public_id)
      .single();

    const fileName = decodeURIComponent(userData?.img.split("/").pop());

    if (fileName !== "user-vector.jpg") {
      await supabase.storage.from("user_avater").remove([fileName]);
    }
    const newFileName = `${Date.now()}_${img.name}`;
    await supabase.storage.from("user_avater").upload(newFileName, img);
    const { data: publicUrlData } = supabase.storage
      .from("user_avater")
      .getPublicUrl(newFileName);
    const avatar_url = publicUrlData.publicUrl;
    await supabase
      .from("user")
      .update({ img: avatar_url })
      .eq("public_id", public_id);
  }
  const { data } = await supabase
    .from("user")
    .update({ name })
    .eq("public_id", public_id)
    .select("*");
  if (data) return { ...data[0], provider };
}
export async function login(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const origin = await getOrigin();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: profile, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    const msg = authErrorToArabic(error.message);
    redirect(`/login?message=${encodeURIComponent(msg)}`);
  }
  const { data: userProfile } = await supabase
    .from("user")
    .select("*")
    .eq("id", profile.user.id) // Use the user's ID to fetch the profile
    .single();

  revalidatePath("/", "layout");
  if (userProfile?.role === "admin") {
    return redirect(`/admin`);
  } else {
    if (userProfile?.role !== "user") {
      await supabase.auth.signOut();
      const msg = " ليس لديك الحق في الوصول إلى هذه الصفحة";
      return redirect(`/login?message=${encodeURIComponent(msg)}`);
    }
    return redirect(
      `${origin}?welcome=${encodeURIComponent(userProfile?.name)}`
    );
  }
}

// export async function DeleteUser() {
//   console.log("j");
//   const supabase = createAdminClient();
//   const { data, error } = await supabase
//     .from("user")
//     .update({ role: "userrr" }) // تغيير الدور إلى 'admin'
//     .eq("id", "4db28cd7-8197-45a9-a847-b4600bac855b");

//   console.log(data);
//   if (error) {
//     console.error("Error deleting user:", error.message);
//     return;
//   }
// }
