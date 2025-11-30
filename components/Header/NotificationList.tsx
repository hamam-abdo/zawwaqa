"use client";

import NotificationItem from "./NotificationItem";
import { TNotificationItem } from "@/types/shared";
import Link from "next/link";

export default function NotificationList({
  notifications,
}: {
  notifications: TNotificationItem[];
}) {
  return (
    <div className="absolute sm:left-0 mt-2 w-54 sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-800">الاشعارات</h3>
      </div>
      <div className="max-h-96 overflow-y-auto scrollbar">
        {notifications.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            لا توجد إشعارات حالياً
          </div>
        )}
        {notifications.map((notif) => (
          <NotificationItem key={notif.id} notif={notif} />
        ))}
      </div>
      <div className="p-3 text-center border-t border-gray-100">
        <Link
          href="/"
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          عرض جميع الاشعارات
        </Link>
      </div>
    </div>
  );
}
