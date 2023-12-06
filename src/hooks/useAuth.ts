import axios from "axios";
import { useRouter } from "next/router";

export const useAuth = () => {
  const router = useRouter();

  const register = async (
    id: string,
    name: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/checkCreateUserStatus/${id}`
      );

      if (!response.data) {
        const user = {
          id: id,
          userName: name,
          password: password,
        };
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/signup`, user);

        router.push({
          pathname: "/timeline",
          query: { sessionId: JSON.stringify(user.id) },
        });

        return true;
      } else {
        alert(
          "既にユーザーIDが登録されています。別のユーザーIDを使用してください。"
        );
        return false;
      }
    } catch (err: any) {
      if (err.response?.data.message) {
        alert(err.response.data.message);
      } else {
        alert(err.response?.data || err.message);
      }
      return false;
    }
  };

  return { register };
};
