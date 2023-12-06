import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <SessionProvider session={pageProps.session}>
        <Header />
        <Component {...pageProps} />
      </SessionProvider>
    </React.StrictMode>
  );
}
