"use client";

import { ChevronUp, ChevronDown, Search as SH, X } from "lucide-react";
import useSearch from "@/hooks/useSearch";
import Link from "next/link";
import { TRestaurant } from "@/types/shared";

export default function Search({
  restaurants,
}: {
  restaurants: TRestaurant[];
}) {
  const {
    query,
    onChange,
    onChangeselect,
    selectedCity,
    setIsOpen,
    isOpen,
    setQuery,
    results,
    loading,
  } = useSearch();
  const ArrowIcon = isOpen ? ChevronUp : ChevronDown;

  const uniquecitys = [...new Set(restaurants.map((item) => item.city))];

  return (
    <div
      className="
    relative w-full border-2 border-orange-100 rounded-lg 
    sm:rounded-xl sm:border-2
  "
    >
      <div
        className="
      absolute top-1/2 bg-[#f2f5f7] h-full -translate-y-1/2
      w-[90px] text-sm
      sm:w-auto sm:text-base
    "
      >
        <div className="relative h-full">
          <select
            value={selectedCity}
            onClick={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            onChange={onChangeselect}
            className="
          appearance-none h-full pr-8 pl-2 text-sm bg-[#f2f5f7] 
          sm:pr-10 sm:pl-4 sm:text-base  outline-none
          rounded-l-lg cursor-pointer

        "
          >
            <option value="الكل">الكل</option>
            {uniquecitys.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>

          <ArrowIcon
            className="
          absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none
          size-3
          sm:right-3 sm:size-5
        "
          />
        </div>
      </div>
      <SH
        className="
      absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 size-4
      sm:left-4 sm:size-6
    "
      />

      {/* Input */}
      <input
        type="text"
        name="search"
        value={query}
        onChange={onChange}
        placeholder="ابحث عن مطعم أو نوع أكل..."
        className="
      w-full pl-10 pr-28 py-3 text-sm outline-none
      sm:pl-14 sm:pr-34 sm:py-4 sm:text-lg
    "
      />

      {query && (
        <button onClick={() => setQuery("")}>
          <X
            className="
        absolute left-8 top-1/2 cursor-pointer -translate-y-1/2 text-gray-400 hover:text-gray-600 size-4
        sm:left-12 sm:size-6
      "
          />
        </button>
      )}

      {typeof results === "object" && (
        <ul className="absolute right-25 sm:right-32 w-[calc(100%-6.25rem)] sm:w-[calc(100%-8rem)] bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto z-50">
          {loading ? null : results.length > 0 ? (
            results.map((r) => (
              <Link
                onClick={() => setQuery("")}
                href={`/restaurant/${r.id}`}
                key={r.id}
                className="px-4 py-3 cursor-pointer   block text-sm sm:text-base hover:bg-gray-100"
              >
                <span className="font-medium">{r.name}</span>

                <span
                  className="
          text-xs   inline-block text-white mr-2   bg-orange-500
        px-2 py-1 rounded-full
      "
                >
                  {r.category}
                </span>
              </Link>
            ))
          ) : (
            <li className="px-4 py-3 text-sm sm:text-base">لا توجد نتائج</li>
          )}
        </ul>
      )}
    </div>
  );
}
