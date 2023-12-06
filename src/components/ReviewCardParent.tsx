import Link from "next/link";
import ReviewCard from "../components/ReviewCard";
import { CompletedComic } from "../types";

export default function ReviewCardParent({
  completedComic,
  genre,
  pageNumber,
}: {
  completedComic: CompletedComic;
  genre: string;
  pageNumber: number;
}) {
  return (
    <div key={completedComic.ID} className="border rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <Link href={`/users/${completedComic.userId}`}>
          <div className="flex items-center">
            <img
              src={completedComic.user.imageUrl}
              alt={completedComic.user.userName}
              className="w-10 h-10 rounded-full mr-2 cursor-pointer"
            />
            <div>
              <p className="text-gray-700 cursor-pointer">
                {completedComic.user.userName}
              </p>
              <p className="text-gray-500 text-sm">{completedComic.userId}</p>
            </div>
          </div>
        </Link>
      </div>
      <p className="text-gray-500 text-sm">
        {new Date(completedComic.createdAt).toLocaleString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <div className="flex">
        <ReviewCard
          key={completedComic.ID}
          completedComic={completedComic}
          genre={genre}
          pageNumber={pageNumber}
          userId={""}
        />
      </div>
    </div>
  );
}
