import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export const useComic = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const register = async (
    itemNumber: string,
    review: string,
    rating: number
  ) => {
    const comic = {
      itemNumber: itemNumber,
      review: review,
      rating: rating,
    };
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/completedComics/${session?.user.id}`,
      comic
    );

    router.push({
      pathname: "/timeline",
      query: { sessionId: JSON.stringify(session?.user.id) }
    });

  };
  return { register };
};
