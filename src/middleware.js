import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/api/auth/signin", // Redirect to this page if not authenticated
  },
});

// Apply middleware only to specific routes
export const config = {
  matcher: [
    "/app/:path*", // Protect all routes under /dashboard
    //"/profile", Protect the /profile route
  ],
};
