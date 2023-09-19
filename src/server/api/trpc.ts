/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { clerkClient } from "@clerk/nextjs";
import { TRPCError, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import {  getAuth } from "@clerk/nextjs/server";
import { prisma } from "~/server/db";

import {Ratelimit} from "@upstash/ratelimit";
import {Redis} from "@upstash/redis";
const redis = new Redis({
  url: "https://us1-sound-quail-40129.upstash.io",
  token: "AZzBACQgYzJlYWY5MTUtOTVlMi00N2I4LTlkYjMtODE5OTdjZDhiNTRmZTQ1NDI4YzU1NzZjNGM4ZWIwYTIzNmZlMzE5YjA3NWY=",
});
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(1, "5 s"),
});

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

type CreateContextOptions = Record<string, never>;

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const {req} = opts
  const {userId} = getAuth(req)


  return {
    prisma,
    userId
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */


const rateLimitMiddleware = t.middleware(async ({ctx,next})=> {
  if(ctx.userId){
    const {success} = await ratelimit.limit(ctx.userId);
    if(!success)
      throw new TRPCError({code:"TOO_MANY_REQUESTS"})
  }
  return next({ctx})
})

const authMiddleware = t.middleware(async ({ctx,next}) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return next({ctx:{
    ...ctx,
    userId:ctx.userId
  }})
})

export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(rateLimitMiddleware).use(authMiddleware);
