"use client";

import { TNotificationItem } from "@/types/shared";
import Link from "next/link";
export default function NotificationItem({
  notif,
}: {
  notif: TNotificationItem;
}) {
  return (
    <Link
      href={`/restaurant/${notif.restaurant?.id}`}
      key={notif.id}
      className="p-4 border-b block border-gray-100 hover:bg-[#ececeba1] transition-all cursor-pointer"
    >
      <p className="text-sm text-gray-800 mb-1">
        {notif.type === "love" ? (
          <>
            حصل مطعمك &quot; {notif.restaurant?.name} &quot; على إعجاب{" "}
            {notif.user?.name}
          </>
        ) : (
          <>
            {notif.user?.name} علّق على مطعمك {notif.restaurant?.name}
          </>
        )}
      </p>

      <p className="text-xs text-gray-500">{notif.timeAgo}</p>
    </Link>
  );
}
