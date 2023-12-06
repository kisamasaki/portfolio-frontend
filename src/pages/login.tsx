import React, { useState, FormEvent } from "react";
import {
  CheckBadgeIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const isDisabled = !id || !pw;

  const submitAuthHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      id: id,
      password: pw,
    });

    if (result) {
      if (result.error) {
        alert("ユーザーIDかパスワードが誤っています。再入力してください。");
      } else if (result.ok) {
        router.push({
          pathname: "/timeline",
          query: { sessionId: JSON.stringify(id) }
        });        
      }
    }
  };

  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      <div className="flex items-center">
        <CheckBadgeIcon className="h-8 w-8 mr-2 text-blue-500" />
        <span className="text-center text-3xl font-extrabold">ログイン</span>
      </div>
      <h2 className="my-6">{"Login"}</h2>
      <form onSubmit={submitAuthHandler}>
        <div className="mb-4">
          <input
            className="px-3 text-sm py-2 w-full rounded-lg border border-gray-300"
            name="userid"
            type="text"
            autoFocus
            placeholder="User ID"
            onChange={(e) => setId(e.target.value)}
            value={id}
          />
        </div>

        <div className="mb-4 relative">
          <input
            className="px-3 text-sm py-2 w-full rounded-lg border border-gray-300"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPw(e.target.value)}
            value={pw}
          />
          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-transparent border-none p-2 cursor-pointer focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex justify-center my-2">
          <button
            className={`py-2 px-4 rounded text-white bg-indigo-600 ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={isDisabled}
          >
            {"ログイン"}
          </button>
        </div>
      </form>
    </div>
  );
}
