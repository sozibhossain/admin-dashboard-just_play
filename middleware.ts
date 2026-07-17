import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    return;
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/bookings/:path*",
    "/users/:path*",
    "/pitch-owners/:path*",
    "/pitches/:path*",
    "/settings/:path*",
    "/emergency/:path*",
    "/reports/:path*",
    "/audit-log/:path*",
    "/issues/:path*",
  ],
};
