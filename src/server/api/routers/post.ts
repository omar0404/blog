
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {

    const posts = await ctx.prisma.post.findMany({orderBy:{'createdAt':'desc'}});
    const users = await clerkClient.users.getUserList({userId:posts.map(post => post.authorId)})

    return posts.map(post => {
      const user = users.find(user => user.id === post.authorId)

      if(!user)
        throw new TRPCError({message:'author is found',code:"INTERNAL_SERVER_ERROR"})
      return {
          ...post,
          author:user
      }
    })

  }),
  create:privateProcedure.input(z.object({content:z.string().min(0).max(100)})).mutation(async({ctx,input})=>{


    await ctx.prisma.post.create({
      data:{
      authorId:ctx.userId,
      content:input.content
      }
    })
  })
});
