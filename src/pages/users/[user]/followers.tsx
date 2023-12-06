import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { User } from "../../../types";
import UserCard from "../../../components/UserCard";

export default function FollowersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  const { user } = router.query;
  const userId = user as string;

  useEffect(() => {
    if (user) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/follow/followers/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("ユーザーデータ取得エラー", error);
        });
    }
  }, [user, userId]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
