import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import { CreatePost } from "~/components/create-post";
import { Posts } from "~/components/posts";

export default function Home() {
  const { user } = useUser();

  return (
    <>
      <Head>
        <title>Blog App</title>
        <meta name="description" content="Blog App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col  justify-between   p-0 ">
        <div className="flex flex-1 justify-end border-b border-slate-400">
          {user ? (
            <SignOutButton>
              <div className="  cursor-pointer p-2 font-bold text-cyan-50">
                Sign out
              </div>
            </SignOutButton>
          ) : (
            <SignInButton>
              <div className=" cursor-pointer p-2 font-bold text-cyan-50">
                Sign in
              </div>
            </SignInButton>
          )}
        </div>
        {user && <CreatePost />}
      </div>
      <Posts />
    </>
  );
}
