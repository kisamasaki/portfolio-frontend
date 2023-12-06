import ReviewCardParent from "./ReviewCardParent";
import { v4 as uuidv4 } from "uuid";
import useSWRInfinite from "swr/infinite";
import axios from "axios";
import { CompletedComic } from "../types";
import { useRouter } from "next/router";

export default function Timeline() {

  const router = useRouter();
  const { sessionId } = router.query;
  const session = JSON.parse(sessionId as string);

  const getComics = async (url: string) => {
    const { data } = await axios.get<CompletedComic[]>(url, {
      withCredentials: true,
    });
    return data;
  };

  const getKey = (pageIndex: number) => {
    const pageNumber = pageIndex + 1;
    return `${process.env.NEXT_PUBLIC_API_URL}/completedComics/follow/${session}/${pageNumber}`;
  };
  const { data, error, size, setSize } = useSWRInfinite(getKey, (url) =>
    getComics(url)
  );

  const isLoading = !data && !error;
  const allData = data ? data.flat() : [];
  const isAllDataLoaded =
    !isLoading && data && data[data.length - 1]?.length >= 10;

  if (error) {
    return (
      <div className="text-center mt-8">
        <div className="text-red-500 text-xl font-bold">
          読み込みに失敗しました
        </div>
      </div>
    );
  }

  if (isLoading || data === undefined) {
    return (
      <div className="text-center mt-8">
        <p className="text-lg text-gray-600 mt-2">
          データを読み込んでいます...
        </p>
      </div>
    );
  }

  return (
    <div className="text-center my-4">
      <h1 className="text-3xl font-bold">友達の活動をチェックしよう</h1>
      <p className="text-lg text-gray-600 mb-8">
        あなたのフォローしているユーザーが読んだコミックやレビューをここで見ることができます。
      </p>
      <>
        {data.length === 0 ? (
          <div className="text-center mt-8">
            <p className="text-lg text-gray-600 mt-2">
              まだ友達の活動がありません。
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {allData.map((completedComic, index) => (
                <ReviewCardParent
                  key={uuidv4()}
                  completedComic={completedComic}
                  genre={"timeline"}
                  pageNumber={Math.floor(index / 10) + 1}
                />
              ))}
            </div>
            {isAllDataLoaded && (
              <div className="mt-4">
                <button
                  onClick={() => setSize(size + 1)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto block"
                >
                  さらに読み込む
                </button>
              </div>
            )}
          </>
        )}
      </>
    </div>
  );
}
