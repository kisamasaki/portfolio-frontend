import ReviewModal from "../../../components/ReviewModal";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Comic } from "../../../types";
import Link from "next/link";
import { useComic } from "../../../hooks/useComic";
import { useSession } from "next-auth/react";

export default function SearchResults() {
  const { register } = useComic();
  const router = useRouter();
  const { searchText, pageNumber } = router.query;
  const [comics, setComics] = useState<Comic[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const Numbers = [1, 2, 3];
  const { data: session } = useSession();

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/comics/${searchText}/${pageNumber}`
        );
        const data = response.data;
        setComics(data);
      } catch (error) {
        console.error("作品データ取得エラー", error);
      }
    };

    fetchData();
  }, [searchText, pageNumber]);

  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);

  const openModal = (comic: Comic) => {
    if (!session) {
      router.push("/login");
      return;
    }
    setSelectedComic(comic);
    setIsModalOpen(true);
  };

  const handleSubmitModal = (review: string, rating: number) => {
    try {
      if (selectedComic) {
        register(selectedComic.itemNumber, review, rating);
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-3xl font-semibold mb-4">
        {searchText} の検索結果
      </h1>
      <div className="grid grid-cols-1 gap-4">
        {comics.map((comic) => (
          <div
            key={comic.itemNumber}
            className="bg-white shadow-md p-4 rounded-lg mb-4 flex flex-col items-center"
          >
            <h2 className="text-xl font-semibold mb-2">{comic.title}</h2>
            <p className="text-gray-600 text-sm font-bold">
              作者: {comic.author}
            </p>
            <img
              src={comic.largeImageUrl}
              alt={comic.title}
              className="w-2/3 h-auto max-h-80 object-contain my-2"
            />
            <p className="text-gray-600 mt-2">発売日: {comic.salesDate}</p>
            <p className="text-gray-600 text-sm my-2">{comic.itemCaption}</p>
            <button
              onClick={() => openModal(comic)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-2"
            >
              読み終えた
            </button>
          </div>
        ))}
      </div>
      <ul className="flex justify-center mt-4">
        {Numbers.map((number) => (
          <li key={number} className="mr-2">
            <Link
              href={`/search/${searchText}/${number}`}
              className={`${
                parseInt(pageNumber as string) === number
                  ? "text-blue-500 font-bold"
                  : "text-gray-500"
              } hover:text-blue-500 cursor-pointer`}
            >
              {number}
            </Link>
          </li>
        ))}
      </ul>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
}
