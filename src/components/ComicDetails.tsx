import React from "react";
import ReviewModal from "./ReviewModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Comic } from "../types";
import { useComic } from "../hooks/useComic";

export default function ComicDetails({
  selectedComic,
}: {
  selectedComic: Comic;
}) {
  const { register } = useComic();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [checkCompletedComic, setCheckCompletedComic] = useState(true);

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  const onCompletedComic = () => {
    if (!session) {
      router.push("/login");
      return;
    }
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/completedComics/check-completedcomic/${id}/${session.user.id}`
          );
          setCheckCompletedComic(response.data);
        }
      } catch (error) {
        console.error("作品データ取得エラー", error);
      }
    };
    fetchData();
  }, [id, session]);

  const onSubmitModal = (review: string, rating: number) => {
    try {
      if (selectedComic) {
        register(selectedComic.itemNumber, review, rating);
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4">{selectedComic.title}</h2>
      <p className="text-sm text-gray-500 mb-2">{selectedComic.author}</p>
      <p className="text-lg mb-6">{selectedComic.itemCaption}</p>
      <p className="text-gray-600 mb-2">{selectedComic.salesDate}</p>
      <img
        src={selectedComic.largeImageUrl}
        alt={selectedComic.title}
        className="w-64 h-96 mb-4"
      />
      {!checkCompletedComic && (
        <button
          onClick={onCompletedComic}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          読み終えた
        </button>
      )}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        onSubmit={onSubmitModal}
      />
    </div>
  );
}
