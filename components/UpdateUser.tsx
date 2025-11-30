"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { updateUser } from "./oauth/actions";
import { FaUserPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/user/Slice";
type Props = {
  open: boolean;
  toggleMenu2: () => void;
  profile: any;
};

export default function UpdateUser({ open, toggleMenu2, profile }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
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
    <Dialog open={open}>
      <DialogContent className="bg-white rounded-2xl p-4 shadow-lg border-0">
        <DialogTitle className="sr-only">تعديل الملف الشخصي</DialogTitle>
        <DialogDescription className="sr-only">
          تحديث بيانات المستخدم
        </DialogDescription>

        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            تعديل الملف الشخصي
          </h2>
        </div>
        {message && (
          <p className=" my-4  text-center text-red-500  ">{message}</p>
        )}

        <form
          onSubmit={async (e) => {
            e.preventDefault(); // لمنع السلوك الافتراضي للنموذج
            setIsUploading(true); // تعيين الحالة إلى true عند بدء العملية
            try {
              const formData = new FormData(e.currentTarget); // جمع بيانات النموذج
              formData.append("public_id", profile?.public_id);
              formData.append("email", profile?.email);
              formData.append("provider", profile?.provider);

              const data = await updateUser(formData);

              dispatch(setUser(data));
              toggleMenu2();
              router.refresh();
            } finally {
              setIsUploading(false);
            }
          }}
          className="space-y-3"
        >
          <div className="flex flex-col items-center gap-3 mb-6">
            <label
              htmlFor="image"
              className="cursor-pointer group relative w-24 h-24 rounded-full bg-gray-100  flex items-center justify-center   transition-all"
            >
              {profile?.img || selectedImage ? (
                <Image
                  src={selectedImage ?? (profile?.img as string)}
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              الاسم
            </label>
            <input
              className="w-full border p-2 rounded-lg"
              defaultValue={profile?.name}
              name="name"
              type="text"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ">
              البريد الإلكتروني
            </label>
            <input
              className="w-full border p-2 rounded-lg bg-[#b8b1b17a]"
              defaultValue={profile?.email}
              name="email"
              type="email"
              disabled
            />
          </div>

          {profile?.provider == "email" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ">
                  كلمة المرور الحالية
                </label>
                <input
                  className="w-full border p-2 rounded-lg "
                  name="password"
                  type="password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ">
                  كلمة المرور الجديدة
                </label>
                <input
                  className="w-full border p-2 rounded-lg "
                  name="newPassword"
                  type="password"
                />
              </div>
            </>
          )}
          <div className="flex gap-2 mt-4">
            <button className="flex-1 bg-linear-to-r cursor-pointer from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold hover:shadow-md transition-all">
              {isUploading ? "جاري التحديث..." : "تحديث البيانات"}
            </button>

            <button
              onClick={toggleMenu2}
              className="px-6 py-3 border cursor-pointer border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
            >
              إلغاء
            </button>
          </div>
        </form>

        {/* --- أزرار --- */}
      </DialogContent>
    </Dialog>
  );
}
