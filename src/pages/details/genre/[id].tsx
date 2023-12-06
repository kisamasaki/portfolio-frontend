import { useRouter } from "next/router";
import ComicDetails from "../../../components/ComicDetails";
import { useQueryGenreComics } from "../../../hooks/useQueryGenreComics";

export default function GenreDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { genre, pageNumber } = router.query;
  const genreStr = (genre as string) || "home";
  const pageNumberStr = (pageNumber as string) || "1";
  const { data, error, isLoading } = useQueryGenreComics(
    genreStr,
    pageNumberStr
  );

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>;
  }

  if (isLoading || !data) {
    return <div>loading...</div>;
  }

  const selectedComic = data.find((comic) => comic.itemNumber === id);

  if (!selectedComic) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-red-500 text-xl font-bold">
          作品が見つかりませんでした。
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {selectedComic ? (
        <ComicDetails selectedComic={selectedComic} />
      ) : (
        <div className="text-center text-red-500 text-xl font-bold">
          作品が見つかりませんでした。
        </div>
      )}
    </div>
  );
}
