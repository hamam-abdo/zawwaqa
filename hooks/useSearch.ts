"use client";
import { useState, useEffect } from "react";
import { searchCities } from "@/components/Server/searchCities";

export default function useSearch() {
  type Restaurant = { id: string; name: string; category: string };
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("الكل");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Restaurant[]>();
  const [loading, setLoading] = useState(false);

  function cleanInput(raw: string) {
    return raw
      .normalize("NFC")
      .replace(/[^a-zA-Z\u0600-\u06FF\s]/g, "") // احذف الرموز غير المسموح بها (اسمح بالمسافات)
      .trim();
  }

  useEffect(() => {
    const cleaned = cleanInput(query);
    if (!cleaned.trim() || cleaned.length < 2) {
      setResults(undefined);
      return;
    }

    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await searchCities(cleaned, selectedCity);
        setResults(data ?? []);
      } finally {
        setLoading(false); // ✅ انتهى البحث
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedCity]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const onChangeselect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
    setTimeout(() => setIsOpen(false), 0);
  };

  return {
    query,
    onChange,
    selectedCity,
    onChangeselect,
    isOpen,
    setIsOpen,
    setQuery,
    results,
    loading,
  };
}
