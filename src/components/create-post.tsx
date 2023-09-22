import { useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

const CreatePost = () => {
  const [value, setValue] = useState("");
  const { user } = useUser();
  const ctx = api.useContext();

  if (!user) return <div />;

  const { mutate, isLoading } = api.post.create.useMutation({
    onMutate() {
      const prevPosts = ctx.post.getAll.getData({});
      ctx.post.getAll.setData({}, (cachedData) => {
        return [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            id: "-999",
            content: value,
            authorId: user.id,
            author: user,
          },
          ...(cachedData || []),
        ];
      });
      return { prevPosts };
    },
    onSuccess() {
      setValue("");
    },
    onError(_, __, context: any) {
      toast.error("Failed to post !");
      ctx.post.getAll.setData({}, context.prevPosts);
    },
  });
  return (
    <div className="flex flex-1 items-center border-b border-slate-400 p-6">
      <Image
        className="rounded-2xl"
        width={30}
        height={30}
        alt="avatar"
        src={user?.imageUrl || ""}
      />
      <input
        value={value}
        disabled={isLoading}
        onChange={(e) => setValue(e.target.value)}
        className="ml-3 flex-1 bg-transparent outline-none"
        placeholder="Write post"
      />
      <button onClick={() => mutate({ content: value })}>Post</button>
    </div>
  );
};
export { CreatePost };
