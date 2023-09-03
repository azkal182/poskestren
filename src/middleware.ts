import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (
      req.nextUrl.pathname?.startsWith("/uks") &&
      req.nextauth.token?.role !== "uks"
    ) {
      // console.log("uks");
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      req.nextUrl.pathname?.startsWith("/asrama") &&
      req.nextauth.token?.role !== "asrama"
    ) {
      //console.log("asrama");
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {

        if (
          req.nextUrl.pathname?.startsWith("/asrama") &&
          token?.role === "asrama"
        ) {
          //console.log("asrama");
          return true;
        }
        
        if (
          req.nextUrl.pathname?.startsWith("/uks") &&
          token?.role === "uks"
        ) {
          //console.log("asrama");
          return true;
        }
        /*
        if (token) {
          return true;
        }
        */
        // else if (req.cookies) return true;
        return false;
      },
    },
  }
);
export const config = { matcher: ["/uks/:path*", "/asrama/:path*"] };
