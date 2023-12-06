import { StarIcon } from "@heroicons/react/24/solid";
import { CompletedComicRes } from "../types";
import Link from "next/link";

export default function ReviewCard({
  completedComic,
  genre,
  pageNumber,
  userId,
}: {
  completedComic: CompletedComicRes;
  genre: string;
  pageNumber: number;
  userId: string;
}) {
  return (
    <div
      key={completedComic.ID}
      className="bg-white rounded-lg shadow p-2 hover:shadow-lg transition duration-300"
    >
      <div className="flex">
        <Link
          href={{
            pathname: `/details/${genre}/${completedComic.comic.itemNumber}`,
            query: userId
              ? { genre, pageNumber, userId }
              : { genre, pageNumber },
          }}
        >
          <img
            src={completedComic.comic.largeImageUrl}
            alt={completedComic.comic.title}
            className="w-24 h-auto mr-2"
          />
        </Link>
        <div>
          <h3 className="text-lg font-semibold">
            {completedComic.comic.title}
          </h3>
          <div className="flex items-center text-gray-500">
            {[1, 2, 3, 4, 5].map((index) => (
              <StarIcon
                key={index}
                className={`w-5 h-5 ${
                  index <= completedComic.rating
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-gray-500">{completedComic.review}</p>
        </div>
      </div>
    </div>
  );
}
