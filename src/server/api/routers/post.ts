
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.input(z.object({userId:z.string().optional(),postId:z.string().optional()})).query(async ({ ctx,input }) => {

    const where:{authorId?:string,id?:string} = {}
    if(input.userId)
      where.authorId = input.userId
      if(input.postId)
      where.id = input.postId


    const posts = await ctx.prisma.post.findMany({orderBy:{'createdAt':'desc'},where:where});
    const users = await clerkClient.users.getUserList({userId:posts.map(post => post.authorId)})

    return posts.map(post => {
      const user = users.find(user => user.id === post.authorId)

      if(!user)
        throw new TRPCError({message:'author is found',code:"INTERNAL_SERVER_ERROR"})
      return {
          ...post,
          author: {
            id:user.id,
            username:user.username,
            imageUrl:user.imageUrl
          }
      }
    })

  }),
  create:privateProcedure.input(z.object({content:z.string().min(1).max(100)})).mutation(async({ctx,input})=>{
    await ctx.prisma.post.create({
      data:{
      authorId:ctx.userId,
      content:input.content
      }
    })
  })
});
