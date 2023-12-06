import { useQueryGenreComics } from "../hooks/useQueryGenreComics";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Genre() {
  const router = useRouter();
  const { genre, pageNumber } = router.query as {
    genre: string;
    pageNumber: string;
  };
  const actualPageNumber = pageNumber || "1";
  let genreCode: string = "";

  if (genre !== undefined) {
    genreCode = genre;
  }

  const { data, error, isLoading } = useQueryGenreComics(
    genreCode,
    actualPageNumber
  );

  const Numbers = [1, 2, 3];

  return (
    <div className="mt-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">エラーが発生しました。</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {data?.map((comic) => (
            <div key={comic.itemNumber} className="flex flex-col items-center">
              <Link
                href={{
                  pathname: `/details/genre/${comic.itemNumber}`,
                  query: { genre: genreCode, pageNumber: actualPageNumber },
                }}
              >
                <div className="text-center">
                  <img
                    src={comic.largeImageUrl}
                    alt={comic.title}
                    className="mb-2 w-32 h-48 mx-auto"
                  />
                  <h2 className="text-lg font-semibold">{comic.title}</h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
      <ul className="flex justify-center mt-4">
        {Numbers.map((number) => (
          <li key={number} className="mr-2">
            <Link
              href={`/genres/${genre}/${number}`}
              className={`${
                number === parseInt(actualPageNumber)
                  ? "text-blue-500 font-bold"
                  : "text-gray-500"
              } hover:text-blue-500 cursor-pointer`}
            >
              {number}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
