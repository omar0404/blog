
import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";
import { createTRPCRouter,  publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({

  get:publicProcedure.input(z.object({id:z.string()})).query(async({ctx,input})=>{
    return clerkClient.users.getUser(input.id)
  })
});
