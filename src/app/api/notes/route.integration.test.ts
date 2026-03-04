/** @jest-environment node */

import type { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/notes/route";
import Note from "@/lib/Note";

describe("GET /api/notes", () => {
	it("should return all notes with status 200", async () => {
		await Note.create({ title: "Note 1", content: "Content 1" });
		await Note.create({ title: "Note 2", content: "Content 2" });

		const res = await GET(new Request("http://localhost/api/notes") as unknown as NextRequest);

		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toHaveLength(2);
		expect(data[0]).toMatchObject({ title: "Note 2", content: "Content 2" });
		expect(data[1]).toMatchObject({ title: "Note 1", content: "Content 1" });
	});

	it("should return empty array when no notes", async () => {
		const res = await GET(new Request("http://localhost/api/notes") as unknown as NextRequest);

		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toHaveLength(0);
	});
});

describe("POST /api/notes", () => {
	it("should create a note with status 201", async () => {
		const res = await POST(
			new Request("http://localhost:3000/api/notes", {
				method: "POST",
				body: JSON.stringify({ title: "New Note", content: "New Content" }),
			}) as unknown as NextRequest,
		);

		expect(res.status).toBe(201);
		const data = await res.json();
		expect(data).toMatchObject({ title: "New Note", content: "New Content" });

		const note = await Note.findById(data._id);
		expect(note).not.toBeNull();
		expect(note?.title).toBe("New Note");
	});
});
