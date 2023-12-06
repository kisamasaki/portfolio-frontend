import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        id: { label: "id", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        var user = {
          id: credentials?.id,
          password: credentials?.password,
          imageUrl: "",
        };
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/login`,
            user
          );
          return {
            name: response.data.userName,
            image: response.data.imageUrl,
            id: response.data.id,
          };
        } catch (err) {
          console.log(err)
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
