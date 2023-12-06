import { useQueryGenreComics } from "../hooks/useQueryGenreComics";
import { useQueryLatestCompletedComics } from "../hooks/useQueryLatestCompletedComics";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../types";
import UserCard from "./UserCard";
import ReviewCardParent from "./ReviewCardParent";
import { v4 as uuidv4 } from "uuid";

export default function Top() {
  const { data, error, isLoading } = useQueryGenreComics("home", "1");
  const { latestData, latestError, isLatestDataLoading } =
    useQueryLatestCompletedComics();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [latestUsers, setLatestUsers] = useState<User[]>([]);

  useEffect(() => {
    const getCurrentTime = () => {
      const now = new Date();
      const formattedTime = `${now.getFullYear()}/${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${now.getDate().toString().padStart(2, "0")} ${now
        .getHours()
        .toString()
        .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      setCurrentTime(formattedTime);
    };

    getCurrentTime();

    const intervalId = setInterval(getCurrentTime, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    async function fetchLatestUsers() {
      try {
        const response = await axios.get<User[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/latestUsers`
        );
        setLatestUsers(response.data);
      } catch (error) {
        console.error("ユーザーデータの取得に失敗しました:", error);
      }
    }
    fetchLatestUsers();
  }, []);

  return (
    <div>
      {isLoading || isLatestDataLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error || latestError ? (
        <div className="text-red-500 text-center">エラーが発生しました。</div>
      ) : (
        <>
          <div className="text-center my-4 flex items-center justify-center">
            <h1 className="text-3xl font-bold">今注目の漫画作品</h1>
            <p className="ml-2 text-sm">{currentTime} 現在</p>
          </div>
          <ul className="grid grid-cols-6 gap-2">
            {data?.map((comic) => (
              <div
                key={comic.itemNumber}
                className="col-span-6 sm:col-span-3 md:col-span-2 lg:col-span-2 xl:col-span-1"
              >
                <Link
                  href={{
                    pathname: `/details/genre/${comic.itemNumber}`,
                    query: { genre: "home", pageNumber: 1 },
                  }}
                >
                  <img
                    src={comic.largeImageUrl}
                    alt={comic.title}
                    className="w-1/2 mx-auto"
                  />
                  <h2 className="text-center mt-2">{comic.title}</h2>
                </Link>
              </div>
            ))}
          </ul>
          <div className="my-8">
            <div className="text-center my-4 flex items-center justify-center">
              <h1 className="text-3xl font-bold">
                最近投稿された感想・レビュー
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {latestData?.map((completedComic) => (
                <ReviewCardParent
                  key={uuidv4()}
                  completedComic={completedComic}
                  genre={"latest"}
                  pageNumber={1}
                />
              ))}
            </div>
          </div>

          <div className="my-8">
            <div className="text-center my-4 flex items-center justify-center">
              <h1 className="text-3xl font-bold">最近登録したユーザー</h1>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {latestUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
