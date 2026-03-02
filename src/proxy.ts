import { type NextRequest, NextResponse } from "next/server";

export const requests = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 10000;
const MAX_REQUESTS = 10;

export function proxy(request: NextRequest) {
	const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";
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
}

export const config = {
	matcher: "/api/:path*",
};
