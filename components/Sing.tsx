"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaUserPlus, FaSpinner } from "react-icons/fa";
import { signup, login } from "./oauth/actions";
import { OAuthButtons } from "./oauth/OAuthButtons";
import { useSearchParams } from "next/navigation";

interface SingProps {
  sing: boolean;
}
export default function Sing({ sing }: SingProps) {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "";
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-linear-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent mb-2">
            ذوّاقة
          </h1>
          <p className="text-gray-600">اكتشف أفضل المطاعم في مدينتك</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {sing ? "إنشاء حساب جديد" : "تسجيل الدخول"}
          </h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault(); // لمنع السلوك الافتراضي للنموذج
              setIsUploading(true); // تعيين الحالة إلى true عند بدء العملية
              try {
                const formData = new FormData(e.currentTarget); // جمع بيانات النموذج

                if (!sing) {
                  await login(formData);
                } else {
                  await signup(formData);
                }
              } finally {
                setIsUploading(false);
              }
            }}
            className="grid gap-6 "
          >
            <div className="space-y-4">
              {sing && (
                <div>
                  {/* 🧡 حاوية رفع الصورة */}
                  <div className="flex flex-col items-center gap-3 mb-6">
                    <label
                      htmlFor="image"
                      className="cursor-pointer group relative w-24 h-24 rounded-full bg-gray-100  flex items-center justify-center   transition-all"
                    >
                      {selectedImage ? (
                        <Image
                          src={selectedImage}
                          alt="Profile Preview"
                          width={100}
                          height={100}
                          className="rounded-full object-cover border"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center  text-gray-400 ">
                          <FaUserPlus size={35} />
                        </div>
                      )}

                      {/* طبقة شفافة عند المرور */}
                      <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <span className="text-xs text-white font-medium">
                          {selectedImage ? "تغيير الصورة" : "اختيار الصورة"}
                        </span>
                      </div>
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      id="image"
                      name="img"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* 🧾 حقل الاسم الكامل */}
                  <label className="block text-gray-700 font-medium mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="أدخل اسمك الكامل"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-300 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="example@email.com"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-300 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-300 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-linear-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                {isUploading ? (
                  <div className=" flex items-center justify-center  gap-2 ">
                    <FaSpinner size={14} className="animate-spin" />
                    معالجة
                  </div>
                ) : sing ? (
                  "إنشاء حساب"
                ) : (
                  "تسجيل الدخول"
                )}
              </button>
            </div>
          </form>
          <p className=" my-4  text-center text-red-500  ">{message}</p>
          <div className="text-center  mt-4">
            <Link
              href={!sing ? "/register" : "/login"}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              {sing ? "لديك حساب؟ سجل الدخول" : "ليس لديك حساب؟ سجل الآن"}
            </Link>
          </div>

          {!sing && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">أو</span>
                </div>
              </div>
              <OAuthButtons />

              <Link
                href="/"
                className="w-full text-gray-600 hover:text-gray-800 font-medium mt-4 block text-center"
              >
                تخطي وتصفح كزائر
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
