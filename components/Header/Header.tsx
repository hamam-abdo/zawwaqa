"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, Bell, Plus } from "lucide-react";
import NotificationList from "./NotificationList";
import Search from "./Search";
import { TRestaurant } from "@/types/shared";
import useHeader from "@/hooks/useHeader";
import { usePathname } from "next/navigation";
import AddRestaurant from "@/components/AddRestaurant";
export default function Header({ restaurant }: { restaurant: TRestaurant[] }) {
  const pathname = usePathname();

  const {
    user,
    favorites,
    notifications,
    newCount,
    showNotifications,
    updatenotifications,
    isMenuOpen,
    toggleMenu,
    signOut,
    open,
    toggleMenu2,
  } = useHeader();
  if (pathname === "/login" || pathname === "/register") return null;
  const hasUser = !!user?.id;

  const Account = [
    {
      path: "/profile",
      title: "حسابي",
      img: "/user.png",
    },

    {
      path: "/",
      title: "تسجيل الخروج",
      img: "/logout.png",
    },
  ];
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto  p-4 relative  ">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-3xl md:text-4xl font-bold bg-linear-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent"
            >
              ذوّاقة
            </Link>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            {hasUser ? (
              <>
                {/* Notifications */}
                <button
                  onClick={updatenotifications}
                  className="relative p-2 cursor-pointer hover:bg-orange-50 rounded-full transition-all"
                >
                  <Bell size={24} className="text-gray-700" />
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {newCount}
                  </span>
                  {showNotifications && (
                    <NotificationList notifications={notifications} />
                  )}
                </button>

                {/* Favorites */}

                <Link
                  href="/favorites"
                  className="relative p-2 cursor-pointer hover:bg-orange-50 rounded-full transition-all"
                >
                  <Heart
                    size={24}
                    className={
                      favorites.length > 0
                        ? "fill-red-500 text-red-500"
                        : "text-gray-700"
                    }
                  />
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                </Link>

                {/* Add Restaurant */}

                <button
                  onClick={toggleMenu2}
                  className="flex cursor-pointer items-center gap-2 bg-linear-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all"
                >
                  <Plus size={18} />
                  <span className="hidden md:inline">أضف مطعم</span>
                </button>
                {open && (
                  <AddRestaurant open={open} toggleMenu2={toggleMenu2} />
                )}

                {/* User Menu */}

                <button className="flex items-center gap-2 relative bg-white md:border-2 border-orange-200 text-orange-600 px-4 py-2 rounded-full hover:bg-orange-50 transition-all">
                  <Image
                    src={user.img}
                    alt={user.name}
                    onClick={toggleMenu}
                    width={35}
                    height={35}
                    className="rounded-full cursor-pointer duration-300 w-10 h-10 hover:shadow-custom " // إضافة تأثير الظل وزيادة الحجم
                  />
                  <span className="hidden md:inline">{user.name}</span>
                  {isMenuOpen && (
                    <ul
                      className="py-3 top-15 left-0  grid z-50 gap-3 w-[200px] absolute
                    bg-linear-to-br from-orange-500/60 to-amber-500/60
                    backdrop-blur-sm
                    text-white font-light rounded-xl shadow-lg
                    transition-all duration-300 ease-in-out"
                    >
                      {Account.map((acc, index) => (
                        <li key={index}>
                          <Link
                            href={
                              index === Account.length - 1
                                ? acc.path
                                : acc.path + `/${user.public_id}`
                            }
                            onClick={
                              index === Account.length - 1 ? signOut : undefined
                            }
                            className="flex items-center justify-end gap-3 py-2 px-4"
                          >
                            {acc.title}
                            <Image
                              src={acc.img}
                              alt={acc.title}
                              width={24}
                              height={24}
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-linear-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>
        </div>

        <Search restaurants={restaurant} />
      </div>
    </header>
  );
}
