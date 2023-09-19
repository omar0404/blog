import { authMiddleware, withClerkMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";


// export default authMiddleware({});

export default withClerkMiddleware(() => {
    return NextResponse.next()
})

export const config = {
      matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
