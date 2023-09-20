import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className="flex h-screen flex-col">
      <Toaster />
      <div className="align- border-stale-400 flex w-full flex-1 flex-col self-center border-x md:max-w-2xl">
        <ClerkProvider {...pageProps}>
          <Component {...pageProps} />
        </ClerkProvider>
      </div>
    </main>
  );
};

export default api.withTRPC(MyApp);
