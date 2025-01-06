import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { authenticateUser } from "@/actions/authActions";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;

        const result = await authenticateUser({ email, password });
        if (result && result.user && result.user.email) {
          return result.user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id; // Add user ID to the token
        token.name = user.name; // Add user name to the token
        token.email = user.email; // Add user email to the token
        token.role = user.role; // Add user role to the token
        token.unitId = user.unitId; // Add user unitId to the token
        token.signatureUrl = user.signatureUrl; // Add user signatureUrl to the token
        token.designation = user.designation; // Add user designation to the token
      }

      if (trigger === "update" && session?.signatureUrl) {
        token.signatureUrl = session.signatureUrl;
      }

      return token;
    },
    async session({ session, token }) {
      // Map token data to session user object
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
        unitId: token.unitId,
        signatureUrl: token.signatureUrl,
        designation: token.designation,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
