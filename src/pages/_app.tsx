import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className="flex h-screen flex-col">
      <Head>
        <title>Blog</title>
        <meta name="description" content="blog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster />
      <div className="align- flex w-full flex-1 flex-col self-center border-x border-slate-400 md:max-w-2xl">
        <ClerkProvider {...pageProps}>
          <Component {...pageProps} />
        </ClerkProvider>
      </div>
    </main>
  );
};

export default api.withTRPC(MyApp);
