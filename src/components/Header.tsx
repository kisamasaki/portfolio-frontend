import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const pageNumber = 1;

  const handleSearch = () => {
    if (searchText.length > 0) {
      router.push(`/search/${searchText}/${pageNumber}`);
    }
  };

  const handleLogout = () => {
    signOut({ redirect: false, callbackUrl: process.env.NEXTAUTH_URL });
    router.push(`/`);
  };

  const handleTimelineClick = () => {
    router.push({
      pathname: "/timeline",
      query: { sessionId: JSON.stringify(session?.user.id) }
    });
  };

  return (
    <header>
      <nav className="bg-blue-500 p-4 flex justify-between items-center">
        <ul className="flex space-x-4">
          {session && (
            <li>
              <a onClick={handleTimelineClick} className="text-white">
                タイムライン
              </a>
            </li>
          )}
          <li>
            <Link href="/" className="text-white">
              ホーム
            </Link>
          </li>
          <li>
            <Link href="/genres/shonen" className="text-white">
              少年部門
            </Link>
          </li>
          <li>
            <Link href="/genres/seinen" className="text-white">
              青年部門
            </Link>
          </li>
          <li>
            <Link href="/genres/shojo" className="text-white">
              少女部門
            </Link>
          </li>
          <li>
            <Link href="/genres/ladies" className="text-white">
              レディース部門
            </Link>
          </li>
        </ul>
        <div className="flex items-center space-x-2 bg-white rounded-md p-2">
          <button
            onClick={handleSearch}
            className="text-blue-500 focus:outline-none"
          >
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>
          <input
            type="text"
            placeholder="作品検索"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="outline-none border-none flex-grow px-2 py-1 h-full"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            検索
          </button>
        </div>
        {session ? (
          <ul className="flex space-x-4">
            <Link href="/myprofile">
              <img
                src={session.user?.image ?? ""}
                alt="Profile"
                className="w-6 h-6 rounded-full"
                style={{ verticalAlign: "middle" }}
              />
            </Link>
            <li>
              <Link href={`/users/${session.user?.id}`} className="text-white">
                マイページ
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-white">
                ログアウト
              </button>
            </li>
          </ul>
        ) : (
          <ul className="flex space-x-4">
            <li>
              <Link href="/signup" className="text-white">
                サインアップ
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-white">
                ログイン
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
