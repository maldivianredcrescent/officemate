import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (
      req.nextUrl.pathname.startsWith("/app/admin") &&
      token?.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => token !== null,
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
  }
);

export const config = {
  matcher: ["/app/:path*"],
};
