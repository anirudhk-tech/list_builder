// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession`, etc.
   */
  interface Session extends DefaultSession {
    user: {
      name: string;
      email: string;
      image: string;
      accessToken?: string;
      refreshToken?: string;
    };
  }

  /**
   * You can also extend the JWT if you’re storing it there
   */
  interface JWT extends DefaultUser {
    accessToken?: string;
    refreshToken?: string;
  }
}
