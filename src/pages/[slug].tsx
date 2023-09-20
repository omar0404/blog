import { clerkClient, useClerk } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Posts } from "~/components/posts";
import { api } from "~/utils/api";

const Profile = () => {
  const {
    query: { slug },
  } = useRouter();
  const id = typeof slug == "string" ? slug : slug?.[0];

  if (!id) return <div />;

  const { data: user } = api.user.get.useQuery({ id });
  if (!user) return <div />;
  return (
    <div>
      <Head>
        <title>{user.username}</title>
      </Head>
      <div className="  h-40 bg-slate-500" />
      <div className="ml-5">
        <Image
          className="-mt-20  rounded-full"
          width={100}
          height={100}
          src={user.imageUrl}
          alt="author-image"
        />
        <div className="text-cayan-500 mt-5 text-2xl font-bold">
          @{user.username}
        </div>
      </div>
      <div className="mt-5">
        <Posts userId={id} />
      </div>
    </div>
  );
};
export default Profile;
