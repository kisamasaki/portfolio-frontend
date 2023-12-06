import React from "react";
import { useSession } from "next-auth/react";
import MyProfile from "@/components/MyProfile";
import Top from "@/components/Top";

export default function UserProfile() {
  const { data: session } = useSession();
  return session ? <MyProfile /> : <Top />;
}
