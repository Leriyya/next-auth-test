import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface jwtArgs {
  token: any;
  user: any;
}

interface sessionArgs {
  session: Session;
  user: any;
  token: any;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch("http://localhost:8000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.username,
            password: credentials?.password,
          }),
        });

        if (res.status > 200) {
          return null;
        }

        const user = await res.json();
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: jwtArgs) {
      return { ...token, ...user };
    },
    async session({ session, token, user }: sessionArgs) {
      session.user = token;
      return session;
    },
  },
};

export default NextAuth(authOptions);
