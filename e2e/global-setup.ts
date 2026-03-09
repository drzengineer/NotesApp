import path from "node:path";
import { encode } from "@auth/core/jwt";
import { chromium, FullConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const TEST_USER = {
	id: "test-user-id-123",
	name: "Test User",
	email: "test@example.com",
	image: "https://example.com/avatar.png",
};

async function globalSetup(_config: FullConfig) {
	const secret = process.env.AUTH_SECRET;
	if (!secret) throw new Error("AUTH_SECRET is not set in .env.local");

	const token = await encode({
		token: {
			sub: TEST_USER.id,
			id: TEST_USER.id,
			name: TEST_USER.name,
			email: TEST_USER.email,
			picture: TEST_USER.image,
		},
		secret,
		salt: "authjs.session-token", // ← was "next-auth.session-token"
	});

	const browser = await chromium.launch();
	const context = await browser.newContext();

	await context.addCookies([
		{
			name: "authjs.session-token", // ← was "next-auth.session-token"
			value: token,
			domain: "localhost",
			path: "/",
			httpOnly: true,
			sameSite: "Lax",
			expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
		},
	]);

	await context.storageState({ path: "playwright-auth-state.json" });
	await browser.close();
}

export default globalSetup;
