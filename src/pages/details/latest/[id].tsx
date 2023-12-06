import { useRouter } from "next/router";
import ComicDetails from "../../../components/ComicDetails";
import { useQueryLatestCompletedComics } from "../../../hooks/useQueryLatestCompletedComics";

export default function LatestDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { latestData, isLatestDataLoading } = useQueryLatestCompletedComics();
  if (isLatestDataLoading || !latestData || !id) {
    return <div>loading...</div>;
  }

  const selectedComic = latestData.find(
    (comic) => comic.comic.itemNumber === id
  );

  if (selectedComic) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ComicDetails selectedComic={selectedComic?.comic} />
      </div>
    );
  } else {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>作品が見つかりませんでした。</p>
      </div>
    );
  }
}
