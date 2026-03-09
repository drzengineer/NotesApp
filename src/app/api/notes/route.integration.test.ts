/** @jest-environment node */

import { GET, POST } from "@/app/api/notes/route";
import Note from "@/lib/Note";

jest.mock("@/auth", () => ({
	auth: jest.fn().mockResolvedValue({
		user: { id: "user_123", name: "Test User" },
	}),
	handlers: {},
	signIn: jest.fn(),
	signOut: jest.fn(),
}));

describe("GET /api/notes", () => {
	it("should return all notes for the user with status 200", async () => {
		await Note.create({ title: "Note 1", content: "Content 1", userId: "user_123" });
		await Note.create({ title: "Note 2", content: "Content 2", userId: "user_123" });

		const res = await GET();

		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toHaveLength(2);
	});

	it("should return empty array when no notes", async () => {
		const res = await GET();

		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toHaveLength(0);
	});

	it("should return 401 when unauthenticated", async () => {
		const { auth } = require("@/auth");
		auth.mockResolvedValueOnce(null);

		const res = await GET();

		expect(res.status).toBe(401);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Unauthorized" });
	});

	it("should only return notes belonging to the authenticated user", async () => {
		await Note.create({ title: "My Note", content: "My Content", userId: "user_123" });
		await Note.create({ title: "Other Note", content: "Other Content", userId: "other_user" });

		const res = await GET();

		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toHaveLength(1);
		expect(data[0]).toMatchObject({ title: "My Note" });
	});
	it("should return 500 on database error", async () => {
		jest.spyOn(Note, "find").mockRejectedValueOnce(new Error("DB error") as any);

		const res = await GET();

		expect(res.status).toBe(500);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Internal server error" });
	});
});

describe("POST /api/notes", () => {
	it("should create a note with status 201", async () => {
		const res = await POST(
			new Request("http://localhost:3000/api/notes", {
				method: "POST",
				body: JSON.stringify({ title: "New Note", content: "New Content" }),
			}),
		);

		expect(res.status).toBe(201);
		const data = await res.json();
		expect(data).toMatchObject({ title: "New Note", content: "New Content", userId: "user_123" });

		const note = await Note.findById(data._id);
		expect(note).not.toBeNull();
		expect(note?.title).toBe("New Note");
		expect(note?.userId).toBe("user_123");
	});

	it("should return 401 when unauthenticated", async () => {
		const { auth } = require("@/auth");
		auth.mockResolvedValueOnce(null);

		const res = await POST(
			new Request("http://localhost:3000/api/notes", {
				method: "POST",
				body: JSON.stringify({ title: "New Note", content: "New Content" }),
			}),
		);

		expect(res.status).toBe(401);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Unauthorized" });
	});

	it("should always use userId from session, never from request body", async () => {
		const res = await POST(
			new Request("http://localhost:3000/api/notes", {
				method: "POST",
				body: JSON.stringify({ title: "New Note", content: "New Content", userId: "hacker_456" }),
			}),
		);

		expect(res.status).toBe(201);
		const data = await res.json();
		expect(data.userId).toBe("user_123");
		expect(data.userId).not.toBe("hacker_456");
	});
	it("should return 500 on database error", async () => {
		jest.spyOn(Note, "create").mockRejectedValueOnce(new Error("DB error") as any);

		const res = await POST(
			new Request("http://localhost:3000/api/notes", {
				method: "POST",
				body: JSON.stringify({ title: "New Note", content: "New Content" }),
			}),
		);

		expect(res.status).toBe(500);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Internal server error" });
	});
});
