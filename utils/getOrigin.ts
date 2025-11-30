"use server";
import { headers } from "next/headers";

export const getOrigin = async () => {
  const h = await headers(); //
  const origin = h.get("origin");
  return origin;
};
