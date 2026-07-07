import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

const DEV_EMAIL = "kunkard@foxmail.com";
const DEV_PASSWORD = "Kard206026";

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url && !url.includes("your-supabase-url");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        // Dev bypass: when Supabase is not configured, accept dev credentials
        if (!isSupabaseConfigured()) {
          if (email === DEV_EMAIL && password === DEV_PASSWORD) {
            return {
              id: "dev-user-1",
              email: DEV_EMAIL,
              name: "Admin",
            };
          }
          return null;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            },
            body: JSON.stringify({ email, password }),
          }
        );

        if (!res.ok) return null;

        const data = await res.json();
        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.email,
          accessToken: data.access_token,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || "dev-secret-kworld-2024-do-not-use-in-production",
});
