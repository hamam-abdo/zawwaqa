interface UserSummary {
  id: string;
  name: string;
  img: string;
  public_id: string;
}

export type TRestaurant = {
  id: number;
  created_at: string;
  name: string;
  description: string;
  category: string;
  city: string;
  rating: number;
  user_id: string;
  image_url: string;
  address: string;
  lat: number;
  lng: number;
  user: UserSummary;
  love_count: number;
  comment_count: number;
  notifications: TNotificationCom[];
};

export type TNotificationCom = {
  id: string;
  comment: string;
  created_at: string;
  rating: number;
  restaurant_id: number;
  type: string;
  user: UserSummary;
};
export type TNotificationItem = {
  id: string;
  type: string;
  created_at: string;
  comment?: string | null;
  rating?: number | null;
  user?: { name: string };
  restaurant?: { id: number; name: string };
  timeAgo?: string;
  isNew?: boolean;
};
