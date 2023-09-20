import React from "react";
import { api } from "~/utils/api";
import { Spinner } from "./spinner";
import dayjs from "dayjs";

import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
dayjs.extend(relativeTime);
const Posts = ({ userId }: { userId?: string }) => {
  const { data: posts, isLoading } = api.post.getAll.useQuery({ userId });
  if (isLoading) return <Spinner />;
  return (
    <div>
      {posts?.map((post) => (
        <Link href={`/${post.authorId}`}>
          <div className="flex flex-row items-center  gap-2 border-b-2 p-4 pb-4 ">
            <Image
              className="rounded-2xl"
              width={30}
              height={30}
              src={post.author.imageUrl}
              alt="author-image"
            />
            <div>
              <div className="flex flex-row gap-2 text-slate-200">
                @{post.author.username}
                <div className="gap-2 text-slate-400">
                  {dayjs(post.createdAt).fromNow()}
                </div>
              </div>
              <div className="text-cyan-50">{post.content}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
export { Posts };
