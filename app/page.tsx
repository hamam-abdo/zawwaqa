import HomePage from "@/components/Home/HomePage";
import getRestaurant from "@/components/Server/getRestaurant";
import { TRestaurant } from "@/types/shared";

export default async function Page() {
  const restaurants: TRestaurant[] = await getRestaurant();

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-amber-50">
      <HomePage serverRestaurants={restaurants} />
    </div>
  );
}
