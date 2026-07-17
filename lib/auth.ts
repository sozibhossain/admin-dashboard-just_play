import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }

        try {
          const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            throw new Error("Login failed");
          }

          const result = await response.json();
          const payload = result?.data ?? result; // API returns { success, data: {...} }
          const userData = payload?.user ?? payload;

          const accessToken = payload?.accessToken;
          const refreshToken = payload?.refreshToken;

          if (!accessToken || !refreshToken) {
            throw new Error("Missing tokens in login response");
          }

          return {
            id: payload?._id ?? userData?._id ?? "",
            name: userData?.name ?? userData?.username ?? credentials.username,
            email: userData?.phone ?? userData?.email ?? "",
            image: userData?.avatar?.url ?? userData?.avatar ?? "",
            accessToken,
            refreshToken,
            role: payload?.role ?? userData?.role ?? "admin",
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string;
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
  },
};
