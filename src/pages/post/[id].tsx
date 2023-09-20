import { useRouter } from "next/router";
import React from "react";
import { Post } from "~/components/post";
import { api } from "~/utils/api";

const PostPage = () => {
  const {
    query: { id },
  } = useRouter();
  const idStr = typeof id == "string" ? id : id?.[0];

  if (!idStr) return <div />;

  const { data: post } = api.post.getAll.useQuery({ postId: idStr });
  if (!post || !post[0]) return <div />;
  return (
    <div>
      <Post {...post[0]} />
    </div>
  );
};
export default PostPage;
