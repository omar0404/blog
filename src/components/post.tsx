import React from "react";
import { RouterOutputs, api } from "~/utils/api";
import { Spinner } from "./spinner";
import dayjs from "dayjs";

import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
dayjs.extend(relativeTime);

type PostProp = RouterOutputs["post"]["getAll"][0];
const Post = (post: PostProp) => {
  return (
    <div>
      <div className="flex flex-row items-center gap-2  border-b  border-slate-400 p-6  ">
        <Image
          className="rounded-2xl"
          width={30}
          height={30}
          src={post.author.imageUrl}
          alt="author-image"
        />
        <div>
          <div className="flex flex-row gap-2 text-slate-200">
            <Link href={`/${post.authorId}`}>@{post.author.username}</Link>
            <Link href={`/post/${post.id}`}>
              <div className="gap-2 text-slate-400">
                {dayjs(post.createdAt).fromNow()}
              </div>
            </Link>
          </div>
          <div className="text-cyan-50">{post.content}</div>
        </div>
      </div>
    </div>
  );
};
export { Post };
