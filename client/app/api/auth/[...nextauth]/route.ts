import NextAuth, { type NextAuthOptions } from "next-auth";
import Reddit from "next-auth/providers/reddit";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Reddit({
      clientId: process.env.REDDIT_CLIENT_ID!,
      clientSecret: process.env.REDDIT_CLIENT_SECRET!,
      authorization: {
        params: {
          duration: "permanent",
          scope: "identity history read mysubreddits",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at! * 1000; // handle expiry time in milliseconds
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user!.accessToken = token.accessToken as string;
        session.user!.refreshToken = token.refreshToken as string;
        session.expires = new Date(
          token.accessTokenExpires! as number
        ).toISOString();
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
