import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string, rating: number) => void;
}

export default function ReviewModal({ isOpen, onClose, onSubmit }: Props) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    onSubmit(comment, rating);
    onClose();
  };

  const handleBackgroundClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur backdrop-filter"
      onClick={handleBackgroundClick}
    >
      <div
        className="bg-white w-96 p-6 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4">感想と評価を入力</h2>
        <textarea
          placeholder="感想を入力してください"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
        />
        <div className="flex items-center mb-4">
          <label className="mr-2">評価:</label>
          {[1, 2, 3, 4, 5].map((index) => (
            <StarIcon
              key={index}
              className={`w-6 h-6 cursor-pointer ${
                index <= rating ? "text-yellow-500" : "text-gray-400"
              }`}
              onClick={() => setRating(index)}
            />
          ))}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
          >
            送信
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg hover:bg-gray-400"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
