import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend the built-in session types
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string;
        }
    }
    
    interface User {
        role?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string;
    }
}

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // In a real app, you'd validate credentials against a database
                if (credentials?.username && credentials?.password) {
                    const user = { 
                        id: "1", 
                        name: "J Smith", 
                        email: "jsmith@example.com", 
                        image: "https://pictures.user.png", 
                        role: "admin" 
                    };
                    return user;
                }
                return null;
            }
        }),

        // Only include OAuth providers if environment variables are set
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            })
        ] : []),
        
        ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [
            GithubProvider({
                clientId: process.env.GITHUB_ID,
                clientSecret: process.env.GITHUB_SECRET,
            })
        ] : []),
    ],
    callbacks: {
        async session({ session, token }) {
            // Add custom properties from token to session
            if (token && session.user) {
                session.user.id = token.sub || "";
                session.user.role = token.role;
                if (token.image && typeof token.image === 'string') {
                    session.user.image = token.image;
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            // Add user info to token on first sign in
            if (user) {
                token.role = user.role;
                token.image = user.image;
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,

};
const handler = NextAuth(authOptions);

export { handler as POST, handler as GET };
//

