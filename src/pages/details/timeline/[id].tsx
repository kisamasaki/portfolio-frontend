import { useRouter } from "next/router";
import ComicDetails from "../../../components/ComicDetails";
import { useSession } from "next-auth/react";
import { CompletedComic } from "../../../types";
import useSWRInfinite from "swr/infinite";
import axios from "axios";

export default function TimelineDetail() {
  const { data: session } = useSession();

  const router = useRouter();
  const { id, pageNumber } = router.query;

  const getComics = async (url: string) => {
    const { data } = await axios.get<CompletedComic[]>(url, {
      withCredentials: true,
    });
    return data;
  };

  const getKey = () => {
    if (session) {
      return `${process.env.NEXT_PUBLIC_API_URL}/completedComics/follow/${session.user.id}/${pageNumber}`;
    }
  };
  const { data, error } = useSWRInfinite(getKey, (url) => getComics(url));

  const isLoading = !data && !error;
  const allData = data ? data.flat() : [];

  if (isLoading || !data || !pageNumber) {
    return <div>loading...</div>;
  }
  const selectedComic = allData.find((comic) => comic.comic.itemNumber === id);

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
