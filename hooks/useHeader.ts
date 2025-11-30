"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { createClient } from "@/utils/supabase/client";
import { setUser, clearUser } from "@/store/user/Slice";
import { setLoves, clearLoves } from "@/store/loves/Slice";
import {
  setnotification,
  clearnotification,
} from "@/store/notifications/Slice";
import getUserData from "@/components/Server/getUserData";
import { formatNotificationDate } from "@/components/formatDistance";
import { useSearchParams } from "next/navigation";

export default function useHeader() {
  const dispatch = useDispatch();
  const searchParam = useSearchParams();
  const welcomeParam = searchParam.get("welcome");
  // Redux states
  const user = useSelector((state: RootState) => state.user);
  const notifications = useSelector((state: RootState) => state.notification);
  const favorites = useSelector((state: RootState) => state.loves);

  const [showNotifications, setShowNotifications] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const hasUser = !!user.id;

  // ---------------------------------------------------------
  // ✅ Fetch User & Notifications on first load
  // ---------------------------------------------------------
  async function fetchUser() {
    const data = await getUserData();

    if (data) {
      const lastSeen = data.user.last_seen_notifications
        ? new Date(data.user.last_seen_notifications)
        : new Date(0);

      const notifWithStatus = data.notifications?.map((item) => {
        const createdAt = new Date(item.created_at);
        return {
          ...item,
          timeAgo: formatNotificationDate(createdAt),
          isNew: createdAt > lastSeen,
        };
      });

      dispatch(setUser(data.user));
      dispatch(setnotification(notifWithStatus));
      dispatch(setLoves(data.userLoves));
    }
  }
  useEffect(() => {
    if (!hasUser) {
      fetchUser();
    }
  }, [welcomeParam]);

  // ---------------------------------------------------------
  // ✅ update notifications popup + mark as seen
  // ---------------------------------------------------------

  const updatenotifications = async () => {
    setShowNotifications(!showNotifications);
    const supabase = createClient();
    await supabase
      .from("user")
      .update({ last_seen_notifications: new Date().toISOString() })
      .eq("id", user.id);

    const updatedNotifications = notifications.map((n) => ({
      ...n,
      isNew: false,
    }));
    dispatch(setnotification(updatedNotifications));
  };

  // ---------------------------------------------------------
  // ✅ User menu toggle
  // ---------------------------------------------------------
  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  // ---------------------------------------------------------
  // ✅ Sign out
  // ---------------------------------------------------------
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();

    dispatch(clearUser());
    dispatch(clearnotification());
    dispatch(clearLoves());
  }

  // ---------------------------------------------------------
  // ✅ Count new notifications
  // ---------------------------------------------------------
  const newCount = notifications.filter((n) => n.isNew).length;

  // ---------------------------------------------------------
  // ✅ Return everything to Header.tsx
  // ---------------------------------------------------------

  function toggleMenu2() {
    setOpen(!open);
  }

  return {
    user,
    notifications,
    favorites,
    newCount,
    showNotifications,
    updatenotifications,
    isMenuOpen,
    toggleMenu,
    signOut,
    open,
    toggleMenu2,

  };
}
