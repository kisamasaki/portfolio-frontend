import React from "react";
import Link from "next/link";
import { User } from "../types";

export default function UserCard({ user }: { user: User }) {
  return (
    <div className="p-4">
      <Link href={`/users/${user.id}`}>
        <div className="flex items-center mb-2">
          <img
            src={user.imageUrl}
            alt={user.userName}
            className="w-10 h-10 rounded-full mr-2"
          />
          <div>
            <p className="text-gray-700 font-semibold">{user.userName}</p>
            <p className="text-gray-500 text-sm">@{user.id}</p>
          </div>
        </div>
      </Link>
      <div className="flex items-center mt-2">
        <p className="mr-2">
          Followings: {user.followings ? user.followings.length : 0}
        </p>
        <p>Followers: {user.followers ? user.followers.length : 0}</p>
      </div>
    </div>
  );
}
