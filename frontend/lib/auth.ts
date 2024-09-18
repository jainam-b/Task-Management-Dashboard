import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from 'axios';

const API_URL = 'https://task-management-dashboard-jainam.vercel.app/api';

export const NEXT_AUTH_CONFIG = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const response = await axios.post(`${API_URL}/login`, {
            email: credentials.email,
            password: credentials.password
          });
          const user = response.data;
          if (user && user.id) {
            return { id: user.id, email: user.email, name: user.name };
          } else {
            throw new Error("Invalid email or password");
          }
        } catch (error) {
          throw new Error("Invalid email or password");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.uid;
      }
      return session;
    },
    async signIn({ user, account, profile }: any) {
      if (account.provider === "google") {
        if (profile.email_verified && profile.email.endsWith("@gmail.com")) {
          try {
            // Check if user exists or create new user
            const response = await axios.post(`${API_URL}/login`, {
              email: profile.email,
              name: profile.name,
              image: profile.picture,
              googleId: profile.sub,
            });
            
            if (!response.data) {
              // If user doesn't exist, register them
              await axios.post(`${API_URL}/register`, {
                email: profile.email,
                name: profile.name,
                image: profile.picture,
                googleId: profile.sub,
              });
            }
            return true;
          } catch (error) {
            console.error("Error during Google sign in:", error);
            return false;
          }
        }
        return false;
      }
      return true;
    },
  },
  pages: {
    signIn: "/signin",
  },
};