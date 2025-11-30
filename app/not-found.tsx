import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-172px)] bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <Image
          src="/error.svg"
          alt="Error 404"
          width={500}
          height={500}
          loading="eager"
          style={{ width: "100%", height: "auto" }} // ✅ يحافظ على نسبة الأبعاد
        />
      </div>

      <p className="text-lg text-gray-600 mb-6 text-center">
        عذرًا، الصفحة التي تبحث عنها غير موجودة.
      </p>

      <Link
        href="/"
        className="bg-linear-to-r from-orange-500 to-amber-500  text-white px-6 py-3 rounded-lg font-medium "
      >
        العودة للصفحة الرئيسية
      </Link>
    </div>
  );
}
