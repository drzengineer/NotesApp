import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

// MongoClient for the adapter — connect() is called so the adapter works correctly.
const client = new MongoClient(process.env.MONGO_URI as string);
const clientPromise = client.connect();

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
		};
	}
}

export const { auth, handlers, signIn, signOut } = NextAuth({
	// The adapter handles account linking (merging GitHub + Google with same email).
	// NOTE: With strategy "jwt", sessions are NOT stored in MongoDB — the adapter
	// is only used for the Users and Accounts collections (account linking).
	adapter: MongoDBAdapter(clientPromise),
	providers: [
		GitHub({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true,
		}),
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true,
		}),
	],
	// JWT strategy: session is stored in a signed cookie, not in the database.
	// AUTH_SECRET in .env is required to sign/verify the JWT.
	session: { strategy: "jwt" },
	callbacks: {
		async jwt({ token, user }) {
			if (user) token.id = user.id;
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id as string;
			return session;
		},
	},
});
