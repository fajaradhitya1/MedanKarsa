import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // HANYA AKUN INI YANG JADI ADMIN
        if (
          credentials?.username === "admin" &&
          credentials?.password === "medankarsa"
        ) {
          let admin = await prisma.user.findUnique({
            where: { email: "admin@medankarsa.com" },
          });

          if (!admin) {
            admin = await prisma.user.create({
              data: {
                email: "admin@medankarsa.com",
                name: "Admin Pusat",
                role: "ADMIN",
                image: "https://ui-avatars.com/api/?name=Admin+Pusat&background=173d2b&color=fff",
              },
            });
          }
          return admin;
        }
        return null;
      },
    }),
  ],
 callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // PENGAMAN UTAMA: Jika email bukan admin pusat, paksa role jadi USER
        token.role = user.email === "admin@medankarsa.com" ? "ADMIN" : "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});