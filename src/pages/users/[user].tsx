import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { User, CompletedComicRes } from "../../types";
import Link from "next/link";
import ReviewCard from "../../components/ReviewCard";
import { useSession } from "next-auth/react";
import useSWRInfinite from "swr/infinite";
import { v4 as uuidv4 } from "uuid";

export default function UserPage() {
  const { data: session } = useSession();

  const router = useRouter();
  const { user } = router.query;

  const [userRes, setUserRes] = useState<User>();
  const [isFollowing, setIsFollowing] = useState(false);
  const userId = user as string;

  useEffect(() => {
    if (user) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/${userId}`)
        .then((response) => {
          setUserRes(response.data);
        })
        .catch((error) => {
          console.error("ユーザーデータ取得エラー", error);
        });

      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/follow/check-follow/${session?.user.id}/${userId}`
        )
        .then((response) => {
          setIsFollowing(response.data.isFollowing);
        })
        .catch((error) => {
          console.error("フォローステータス取得エラー", error);
        });
    }
  }, [user, userId, session?.user.id]);

  const toggleFollow = () => {
    if (!session) {
      router.push("/login");
      return;
    }

    const followerId = user as string;

    if (isFollowing) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/follow/unfollow/${session?.user.id}/${followerId}`
        )
        .then((response) => {
          setIsFollowing(!isFollowing);

          axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/${userId}`)
            .then((response) => {
              setUserRes(response.data);
            })
            .catch((error) => {
              console.error("ユーザーデータ取得エラー", error);
            });
        })
        .catch((error) => {
          console.error("フォロー切り替えエラー", error);
        });
    } else {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/follow/${session?.user.id}/${followerId}`
        )
        .then((response) => {
          setIsFollowing(!isFollowing);
          axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/${userId}`)
            .then((response) => {
              setUserRes(response.data);
            })
            .catch((error) => {
              console.error("ユーザーデータ取得エラー", error);
            });
        })
        .catch((error) => {
          console.error("フォロー切り替えエラー", error);
        });
    }
  };

  const getComics = async (url: string) => {
    const { data } = await axios.get<CompletedComicRes[]>(url, {
      withCredentials: true,
    });
    return data;
  };

  const getKey = (pageIndex: number) => {
    const pageNumber = pageIndex + 1;
    return `${process.env.NEXT_PUBLIC_API_URL}/completedComics/user/${userId}/${pageNumber}`;
  };

  const { data, error, size, setSize } = useSWRInfinite(getKey, (url) =>
    getComics(url)
  );

  const isLoading = !data && !error;
  const allData = data ? data.flat() : [];
  const isAllDataLoaded =
    !isLoading && data && data[data.length - 1]?.length < 10;

  if (error || isLoading) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div className="bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center">
          <img
            src={userRes?.imageUrl}
            alt={userRes?.userName}
            className="w-32 h-32 rounded-full mr-4"
          />
          <div>
            <p className="text-gray-500">@{userRes?.id}</p>
            <p className="text-2xl font-semibold">
              {userRes?.userName}さんのプロフィール
            </p>
            <Link
              href={
                userRes
                  ? userRes.followings.length > 0
                    ? `/users/${userId}/followings`
                    : "#"
                  : "#"
              }
            >
              <div
                className={`bg-white rounded-lg shadow p-4 hover:shadow-lg cursor-pointer ${
                  userRes?.followings.length === 0
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                <div className="text-center">
                  <p className="text-gray-500">Following</p>
                  <p className="text-xl font-semibold">
                    {userRes?.followings.length}
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href={
                userRes
                  ? userRes.followers.length > 0
                    ? `/users/${userId}/followers`
                    : "#"
                  : "#"
              }
            >
              <div
                className={`bg-white rounded-lg shadow p-4 hover:shadow-lg cursor-pointer ${
                  userRes?.followers.length === 0
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                <div className="text-center">
                  <p className="text-gray-500">Followers</p>
                  <p className="text-xl font-semibold">
                    {userRes?.followers.length}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        {session?.user.id !== userId && (
          <button
            onClick={toggleFollow}
            className={`px-4 py-2 rounded-full ${
              isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">読み終えた漫画作品</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allData.map((comic, index) => (
              <ReviewCard
                key={uuidv4()}
                completedComic={comic}
                genre={"user"}
                pageNumber={Math.floor(index / 10) + 1}
                userId={userId}
              />
            ))}
          </div>

          {!isAllDataLoaded && (
            <div className="mt-4">
              <button
                onClick={() => setSize(size + 1)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto block"
              >
                さらに読み込む
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
