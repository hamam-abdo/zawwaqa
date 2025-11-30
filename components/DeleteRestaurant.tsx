"use client";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
type Props = {
  open: boolean;
  toggleMenu2: () => void;
  id: number;
  image: string;
};
export default function DeleteRestaurant({
  open,
  toggleMenu2,
  id,
  image,
}: Props) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const Delete = async () => {
    setIsUploading(true);
    try {
      const supabase = createClient();
      const fileName = decodeURIComponent(image.split("/").pop()!);

      await supabase.storage.from("Restaurant").remove([fileName]);
      await supabase.from("restaurants").delete().eq("id", id);

      toggleMenu2();
      router.refresh();
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent
        className="
      bg-white rounded-2xl p-4 shadow-lg border-0

    "
      >
        {/* ✅ Accessible Title */}
        <DialogTitle className="sr-only">أضف مطعمك المفضل</DialogTitle>

        <DialogDescription className="sr-only">
          Fixed the warning
        </DialogDescription>
        <div className="text-center mb-2">
          <div className="text-red-600 flex justify-center mb-4 ">
            <Trash2 size={28} />
          </div>

          <h2 className=" font-bold text-gray-600 mb-1">
            هل أنت متأكد من رغبتك في حذف هذا المطعم؟
          </h2>
        </div>

        <div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => Delete()}
              type="submit"
              className="flex-1  cursor-pointer bg-linear-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold hover:shadow-md transition-all"
            >
              {isUploading ? "جاري حذف..." : " حذف المطعم"}
            </button>

            <button
              type="button"
              onClick={() => toggleMenu2()}
              className="px-6 py-3 border cursor-pointer border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            >
              إلغاء
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
