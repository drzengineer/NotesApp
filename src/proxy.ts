import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const requests = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 10000;
const MAX_REQUESTS = 50;

const PROTECTED_ROUTES = ["/create", "/notes", "/api/notes"];

export default auth((req) => {
	// auth check runs first — redirect before rate limiting
	const isProtected = PROTECTED_ROUTES.some((route) => req.nextUrl.pathname.startsWith(route));

	if (isProtected && !req.auth) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	// skip rate limiting in test environment
	if (process.env.NEXT_PUBLIC_IS_TEST === "true") return NextResponse.next();

	const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";
	const now = Date.now();
	const record = requests.get(ip);

	if (!record || now > record.resetTime) {
		requests.set(ip, { count: 1, resetTime: now + WINDOW_MS });
		return NextResponse.next();
	}

	if (record.count >= MAX_REQUESTS) {
		return NextResponse.json({ error: "Too many requests" }, { status: 429 });
	}

	record.count++;
	return NextResponse.next();
});

export const config = {
	matcher: [
		"/create",
		"/notes/:path*",
		"/api/:path*", // covers both rate limiting and auth for API routes
	],
};
