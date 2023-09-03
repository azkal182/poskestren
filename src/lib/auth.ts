import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  
   pages: {
       signIn: "/auth/login",
       signOut: "/",
     },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "john doe" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials:any) {
      	console.log(credentials)
      	if (!credentials.username || !credentials.password) {
      		throw new Error('password dan username tidak boleh kosong')
      	}
        const user = await prisma.user.findFirst({
          where: {
            username: credentials.username,
          },
        });

        if (!user) {
          throw new Error(
          	"user tidak ditemukan"
            //JSON.stringify({ errors: user.errors, status: false })
          );
        }

        if (credentials.password !== user.password) {
          throw new Error(
           // JSON.stringify({ errors: user.errors, status: false })
           "username or password is wrong"
          );
        }

        return user;
      },
    }),
    // GoogleProvider({
//       clientId:
//         "590598645827-7rl2p792d440uh69rig2antcve55dhbj.apps.googleusercontent.com",
//       clientSecret: "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",
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//     }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("fire signin Callback");
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("fire redirect Callback");
      
      return url;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("fire jwt Callback");
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          role: u.role,
          randomKey: u.randomKey,
        };
      }

      return token;
    },
    async session({ session, user, token }) {
      console.log("fire SESSION Callback");

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey,
        },
      };
    },
  },
};
