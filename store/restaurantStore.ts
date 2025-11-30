import { create } from "zustand";
import { TRestaurant } from "@/types/shared";

interface RestaurantState {
  restaurants: TRestaurant[];
  setRestaurants: (data: TRestaurant[] | ((prev: TRestaurant[]) => TRestaurant[])) => void;
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurants: [],
  setRestaurants: (data) =>
    set((state) => ({
      restaurants: typeof data === "function" ? data(state.restaurants) : data,
    })),
}));
