import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  setUserRating?: (rating: number) => void;
}
export default function StarRating({ rating, setUserRating }: StarRatingProps) {
  return (
    <div className=" flex gap-1">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <Star
            size={22}
            key={index}
            onClick={() => setUserRating && setUserRating(index)}
            className={` ${setUserRating && "cursor-pointer"}  ${
              rating >= index
                ? "text-amber-400  fill-amber-400"
                : "text-gray-400"
            }`}
          />
        );
      })}
    </div>
  );
}
