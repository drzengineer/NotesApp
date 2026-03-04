/** @jest-environment node */
/** biome-ignore-all lint/suspicious/noExplicitAny: Too verbose for test file */

import type { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/notes/route";
import Note from "@/lib/Note";

jest.mock("@/lib/db", () => ({
	connectDB: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("next/cache", () => ({
	revalidatePath: jest.fn(),
}));

beforeEach(() => {
	jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("GET /api/notes", () => {
	it("should return notes with status 200", async () => {
		jest.spyOn(Note, "find").mockReturnValue({
			sort: jest.fn().mockResolvedValue([
				{ _id: "1", title: "Note 1", content: "Content 1", createdAt: new Date() },
				{ _id: "2", title: "Note 2", content: "Content 2", createdAt: new Date() },
			]),
		} as any);
		const res = await GET(new Request("http://localhost/api/notes") as unknown as NextRequest);

		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toHaveLength(2);
		expect(data[0]).toMatchObject({ _id: "1", title: "Note 1", content: "Content 1" });
		expect(data[1]).toMatchObject({ _id: "2", title: "Note 2", content: "Content 2" });
	});

	it("should return status 500 on error", async () => {
		jest.spyOn(Note, "find").mockReturnValue({
			sort: jest.fn().mockRejectedValue(new Error("DB error")),
		} as any);
		const res = await GET(new Request("http://localhost/api/notes") as unknown as NextRequest);

		expect(res.status).toBe(500);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Internal server error" });
	});
});

describe("POST /api/notes", () => {
	it("should create a note with status 201", async () => {
		jest.spyOn(Note.prototype, "save").mockResolvedValue({
			title: "New Note",
			content: "New Content",
		} as any);
		const res = await POST(
			new Request("http://localhost:3000/api/notes", {
				method: "POST",
				body: JSON.stringify({ title: "New Note", content: "New Content" }),
			}) as unknown as NextRequest,
		);

		expect(res.status).toBe(201);
		const data = await res.json();
		expect(data).toMatchObject({ title: "New Note", content: "New Content" });
	});

	it("should return status 500 on error", async () => {
		jest.spyOn(Note.prototype, "save").mockRejectedValue(new Error("DB error"));
		const res = await POST(
			new Request("http://localhost:3000/api/notes", {
				method: "POST",
				body: JSON.stringify({ title: "New Note", content: "New Content" }),
			}) as unknown as NextRequest,
		);

		expect(res.status).toBe(500);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Internal server error" });
	});
});
