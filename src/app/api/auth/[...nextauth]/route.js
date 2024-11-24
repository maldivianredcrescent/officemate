import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { authUserAction } from "@/actions/authActions";
import { prisma } from "@/lib/prisma";
import { signIn } from "next-auth/react";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Implement your authentication logic here
        const { email, password } = credentials;

        // Example: Replace this with your database or API call
        const user = { id: 1, name: "John Doe", email: "example@example.com" }; // Mocked user

        if (email === user.email && password === "password123") {
          return user;
        }
        // Return null if the authentication fails
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Add user ID to the token
        token.name = user.name; // Add user name to the token
        token.email = user.email; // Add user email to the token
      }
      return token;
    },
    async session({ session, token }) {
      // Map token data to session user object
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
