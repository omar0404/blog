import Head from "next/head";
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
      <Head>
        <title>{`${post[0].content} - @${post[0].author.username}`}</title>
      </Head>
      <Post {...post[0]} />
    </div>
  );
};
export default PostPage;
