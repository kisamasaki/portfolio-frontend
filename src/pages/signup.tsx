import React, { useState, FormEvent } from "react";
import {
  CheckBadgeIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "../hooks/useAuth";
import { signIn } from "next-auth/react";

export default function Signup() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [idError, setIdError] = useState("");
  const [nameError, setNameError] = useState("");
  const [pwError, setPwError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();

  const validateForm = () => {
    let valid = true;

    if (id.length < 4 || id.length > 16) {
      setIdError("ユーザーIDは4文字から16文字の間である必要があります。");
      valid = false;
    } else {
      setIdError("");
    }

    if (name.length < 1 || name.length > 16) {
      setNameError("ユーザー名は1文字から16文字の間である必要があります。");
      valid = false;
    } else {
      setNameError("");
    }

    if (pw.length < 6 || pw.length > 16) {
      setPwError("パスワードは6文字から16文字の間である必要があります。");
      valid = false;
    } else {
      setPwError("");
    }

    return valid;
  };

  const submitAuthHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const registrationSuccessful = await register(id, name, pw);

    if (registrationSuccessful) {
      await signIn("credentials", {
        redirect: false,
        id: id,
        password: pw,
      });
    }
  };

  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      <div className="flex items-center">
        <CheckBadgeIcon className="h-8 w-8 mr-2 text-blue-500" />
        <span className="text-center text-3xl font-extrabold">
          メンバー登録
        </span>
      </div>
      <h2 className="my-6">サインアップ</h2>
      <form onSubmit={submitAuthHandler}>
        <div className="mb-4">
          <input
            className={`px-3 text-sm py-2 w-full rounded-lg ${
              idError ? "border border-red-500" : "border border-gray-300"
            }`}
            name="userid"
            type="text"
            autoFocus
            placeholder="User ID"
            onChange={(e) => setId(e.target.value)}
            value={id}
          />
          {idError && <p className="text-red-500 text-xs mt-1">{idError}</p>}
        </div>

        <div className="mb-4">
          <input
            className={`px-3 text-sm py-2 w-full rounded-lg ${
              nameError ? "border border-red-500" : "border border-gray-300"
            }`}
            name="username"
            type="text"
            placeholder="User Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          {nameError && (
            <p className="text-red-500 text-xs mt-1">{nameError}</p>
          )}
        </div>

        <div className="mb-4 relative">
          <input
            className={`px-3 text-sm py-2 w-full rounded-lg ${
              pwError ? "border border-red-500" : "border border-gray-300"
            }`}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPw(e.target.value)}
            value={pw}
          />
          {pwError && <p className="text-red-500 text-xs mt-1">{pwError}</p>}
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
            className={`py-2 px-4 rounded text-white bg-indigo-600`}
            type="submit"
            disabled={false}
          >
            登録
          </button>
        </div>
      </form>
    </div>
  );
}
