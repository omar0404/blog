import React from "react";
import { api } from "~/utils/api";
import { Spinner } from "./spinner";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import { Post } from "./post";
dayjs.extend(relativeTime);

const Posts = ({ userId }: { userId?: string }) => {
  const { data: posts, isLoading } = api.post.getAll.useQuery({ userId });
  if (isLoading) return <Spinner />;
  return <div>{posts?.map((post) => <Post {...post} />)}</div>;
};
export { Posts };
