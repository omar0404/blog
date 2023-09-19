import React from "react";
import { api } from "~/utils/api";
import { Spinner } from "./spinner";
import  dayjs from 'dayjs'

import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const Posts = () => {
  const {data:posts,isLoading} = api.post.getAll.useQuery();
if(isLoading)
    return <Spinner />
return (
    <div >
    {posts?.map(post =>
    <div className="p-4 border-b-2 pb-4  flex flex-row items-center gap-2 ">
      <Image className="rounded-2xl" width={30} height={30} src={post.author.imageUrl} alt="author-image" />
     <div className="text-cyan-50">{post.content}</div>
     <div className="text-slate-400">{dayjs(post.createdAt).fromNow()}</div>
     </div>
    )}
    </div>
)
}
export {Posts}