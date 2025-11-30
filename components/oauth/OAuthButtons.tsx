"use client";

import { Provider } from "@supabase/supabase-js";
import { FaGithub } from "react-icons/fa"; // استيراد أيقونات Google و GitHub
import { OAuthSignIn } from "./actions";
import Image from "next/image";
import { ReactNode } from "react";
type OAuthProvider = {
  name: Provider;
  displayName: string;
  icon?: ReactNode;
  img?: string;
};

export function OAuthButtons() {
  const providers: OAuthProvider[] = [
    {
      name: "google",
      displayName: "Google",
      img: "/login-Google.png", // استخدام أيقونة Google
    },
    {
      name: "github",
      displayName: "GitHub",
      icon: <FaGithub size={24} />, // استخدام أيقونة GitHub
    },
    // يمكنك إضافة المزيد من مزودي OAuth حسب الحاجة
  ];
  return (
    <div className=" grid gap-4 mt-5">
      {providers.map((provider) => (
        <button
          key={provider.name}
          className="ww-full border-2 border-gray-200 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-3 cursor-pointer"
          onClick={async () => await OAuthSignIn(provider.name)}
        >
          {provider.icon ? (
            provider.icon
          ) : (
            <Image src={provider.img!} alt="google" width={24} height={24} />
          )}
          تابع باستخدام {provider.displayName}
        </button>
      ))}
    </div>
  );
}
