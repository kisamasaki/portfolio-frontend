import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession, signOut } from "next-auth/react";

export default function MyProfile() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { data: session } = useSession();

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleLogout = () => {
    signOut({ redirect: false, callbackUrl: process.env.NEXTAUTH_URL });
    router.push(`/`);
  };

  const confirmDeleteAccount = () => {
    toggleDeleteModal();
  };

  const deleteAccount = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/${session?.user.id}`
      );
      handleLogout();
    } catch (error) {
      console.error("削除エラー:", error);
    }
    toggleDeleteModal();
  };

  const router = useRouter();
  let userName: string;

  useEffect(() => {
    if (!session || !session.user || !session.user.id) {
      router.push("/");
    }
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/${session?.user.id}`)
      .then((response) => {
        userName = response.data.userName;
        setEditedUserName(userName);
      })
      .catch((error) => {
        console.error("ユーザーデータ取得エラー", error);
      });
  }, [session, router]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editedUserName, setEditedUserName] = useState<string | undefined>(
    undefined
  );
  const [displayImage, setdisplayImage] = useState(session?.user?.image);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setdisplayImage(URL.createObjectURL(file));
    }
  };

  const handleSaveButtonClick = async () => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    if (editedUserName !== userName) {
      formData.append("userName", editedUserName ?? "");
    }

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/${session?.user.id}`,
      formData
    );
    if (response.status === 200) {
      setSelectedFile(null);
      setIsSuccessModalOpen(true);
    }
  };

  return (
    <div className="bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 text-center">
        <h1 className="text-2xl font-semibold">
          ユーザーID: {session?.user?.id}
        </h1>
        <img
          src={displayImage}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mt-4"
        />
        <label
          htmlFor="fileInput"
          className="block cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-full mx-auto mt-4"
        >
          プロフィール画像を変更する
        </label>
        <input
          type="file"
          id="fileInput"
          name="image"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
        <label htmlFor="userNameInput" className="block mt-4 font-semibold">
          ユーザー名
        </label>
        <input
          type="text"
          id="userNameInput"
          value={editedUserName || ""}
          onChange={(e) => setEditedUserName(e.target.value)}
          className="mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 mx-auto block w-3/5"
        />
        <button
          onClick={handleSaveButtonClick}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-full mx-auto block"
        >
          変更内容を保存する
        </button>
        <button
          onClick={confirmDeleteAccount}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full mx-auto block"
        >
          退会する
        </button>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <p>変更が成功しました。</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    router.reload();
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <p>本当にアカウントを削除しますか？</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={deleteAccount}
                  className="bg-red-500 text-white px-4 py-2 rounded-full"
                >
                  はい
                </button>
                <button
                  onClick={toggleDeleteModal}
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
