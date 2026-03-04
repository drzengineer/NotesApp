/** @jest-environment node */

import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { DELETE, GET, PUT } from "@/app/api/notes/[id]/route";
import Note from "@/lib/Note";

const fakeId = new mongoose.Types.ObjectId().toString();

describe("GET /api/notes/[id]", () => {
	it("should return a note with status 200", async () => {
		const note = await Note.create({ title: "Note 1", content: "Content 1" });

		const res = await GET(
			new Request("http://localhost/api/notes/[id]") as unknown as NextRequest,
			{ params: Promise.resolve({ id: note.id }) },
		);

		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toMatchObject({ title: "Note 1", content: "Content 1" });
	});

	it("should return 404 when note not found", async () => {
		const res = await GET(
			new Request("http://localhost/api/notes/[id]") as unknown as NextRequest,
			{ params: Promise.resolve({ id: fakeId }) },
		);

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Note not found" });
	});

	it("should catch error with 500 status", async () => {
		const res = await GET(
			new Request("http://localhost/api/notes/[id]") as unknown as NextRequest,
			{ params: Promise.resolve({ id: "-1" }) },
		);

		expect(res.status).toBe(500);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Internal server error" });
	});
});

describe("PUT /api/notes/[id]", () => {
	const makePutReq = () =>
		new Request("http://localhost/api/notes/[id]", {
			method: "PUT",
			body: JSON.stringify({ title: "Updated Note", content: "Updated Content" }),
		}) as unknown as NextRequest;

	it("should return a note with status 200", async () => {
		const note = await Note.create({ title: "Note 1", content: "Content 1" });

		const res = await PUT(makePutReq(), { params: Promise.resolve({ id: note.id }) });

		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toMatchObject({ title: "Updated Note", content: "Updated Content" });

		const updatedNote = await Note.findById(note.id);
		expect(updatedNote?.title).toBe("Updated Note");
		expect(updatedNote?.content).toBe("Updated Content");
	});

	it("should return a 404 status", async () => {
		const res = await PUT(makePutReq(), { params: Promise.resolve({ id: fakeId }) });

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Note not found" });
	});

	it("should catch error with 500 status", async () => {
		const res = await PUT(makePutReq(), { params: Promise.resolve({ id: "-1" }) });

		expect(res.status).toBe(500);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Internal server error" });
	});
});

describe("DELETE /api/notes/[id]", () => {
	it("should delete a note with status 200", async () => {
		const note = await Note.create({ title: "Note 1", content: "Content 1" });

		const res = await DELETE(
			new Request("http://localhost/api/notes/[id]") as unknown as NextRequest,
			{ params: Promise.resolve({ id: note.id }) },
		);

		expect(res.status).toBe(200);
		const data = await res.json();
		const deletedNote = await Note.findById(data._id);
		expect(deletedNote).toBeNull();
	});

	it("should return 404 when note not found", async () => {
		const res = await DELETE(
			new Request("http://localhost/api/notes/[id]") as unknown as NextRequest,
			{ params: Promise.resolve({ id: fakeId }) },
		);

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Note not found" });
	});

	it("should catch error with 500 status", async () => {
		const res = await DELETE(
			new Request("http://localhost/api/notes/[id]") as unknown as NextRequest,
			{ params: Promise.resolve({ id: "-1" }) },
		);

		expect(res.status).toBe(500);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Internal server error" });
	});
});
