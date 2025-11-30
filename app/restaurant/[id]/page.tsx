import NotFound from "@/app/not-found";
import Restaurant_Details from "@/components/Restaurant/Restaurant_Details";

import getRestaurant from "@/components/Server/getRestaurant";
export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  const restaurant = await getRestaurant(resolvedParams.id);
  if (!restaurant) return NotFound();

  return <Restaurant_Details restaurant={restaurant} />;
}
