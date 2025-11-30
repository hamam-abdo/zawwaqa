import getRestaurant from "@/components/Server/getRestaurant";
import Favorites from "./Favorites";
export default async function FavoritesPage() {
  const restaurant = await getRestaurant();

  return <Favorites restaurant={restaurant} />;
}
