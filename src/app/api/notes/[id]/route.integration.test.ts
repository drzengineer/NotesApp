/** @jest-environment node */

import mongoose from "mongoose";
import { DELETE, GET, PUT } from "@/app/api/notes/[id]/route";
import Note from "@/lib/Note";

jest.mock("@/auth", () => ({
	auth: jest.fn().mockResolvedValue({
		user: { id: "user_123", name: "Test User" },
	}),
	handlers: {},
	signIn: jest.fn(),
	signOut: jest.fn(),
}));

const fakeId = new mongoose.Types.ObjectId().toString();

const makeParams = (id: string) => ({ params: Promise.resolve({ id }) });
const makeReq = (method = "GET", body?: object) =>
	new Request("http://localhost/api/notes/[id]", {
		method,
		...(body ? { body: JSON.stringify(body) } : {}),
	});

describe("GET /api/notes/[id]", () => {
	it("should return a note with status 200", async () => {
		const note = await Note.create({ title: "Note 1", content: "Content 1", userId: "user_123" });

		const res = await GET(makeReq(), makeParams(note.id));

		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toMatchObject({ title: "Note 1", content: "Content 1" });
	});

	it("should return 401 when unauthenticated", async () => {
		const { auth } = require("@/auth");
		auth.mockResolvedValueOnce(null);

		const res = await GET(makeReq(), makeParams(fakeId));

		expect(res.status).toBe(401);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Unauthorized" });
	});

	it("should return 404 when note not found", async () => {
		const res = await GET(makeReq(), makeParams(fakeId));

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Not found" });
	});

	it("should return 404 when note belongs to another user", async () => {
		const note = await Note.create({ title: "Note 1", content: "Content 1", userId: "other_user" });

		const res = await GET(makeReq(), makeParams(note.id));

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Not found" });
	});

	it("should return 500 on invalid id", async () => {
		const res = await GET(makeReq(), makeParams("-1"));

		expect(res.status).toBe(500);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Internal server error" });
	});
});

describe("PUT /api/notes/[id]", () => {
	it("should update a note with status 200", async () => {
		const note = await Note.create({ title: "Note 1", content: "Content 1", userId: "user_123" });

		const res = await PUT(
			makeReq("PUT", { title: "Updated Note", content: "Updated Content" }),
			makeParams(note.id),
		);

		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toMatchObject({ title: "Updated Note", content: "Updated Content" });

		const updatedNote = await Note.findById(note.id);
		expect(updatedNote?.title).toBe("Updated Note");
		expect(updatedNote?.content).toBe("Updated Content");
	});

	it("should return 401 when unauthenticated", async () => {
		const { auth } = require("@/auth");
		auth.mockResolvedValueOnce(null);

		const res = await PUT(
			makeReq("PUT", { title: "Updated Note", content: "Updated Content" }),
			makeParams(fakeId),
		);

		expect(res.status).toBe(401);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Unauthorized" });
	});

	it("should return 404 when note not found", async () => {
		const res = await PUT(
			makeReq("PUT", { title: "Updated Note", content: "Updated Content" }),
			makeParams(fakeId),
		);

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Not found" });
	});

	it("should return 404 when note belongs to another user", async () => {
		const note = await Note.create({ title: "Note 1", content: "Content 1", userId: "other_user" });

		const res = await PUT(
			makeReq("PUT", { title: "Updated Note", content: "Updated Content" }),
			makeParams(note.id),
		);

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Not found" });
	});

	it("should return 500 on invalid id", async () => {
		const res = await PUT(
			makeReq("PUT", { title: "Updated Note", content: "Updated Content" }),
			makeParams("-1"),
		);

		expect(res.status).toBe(500);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Internal server error" });
	});
});

describe("DELETE /api/notes/[id]", () => {
	it("should delete a note with status 200", async () => {
		const note = await Note.create({ title: "Note 1", content: "Content 1", userId: "user_123" });

		const res = await DELETE(makeReq(), makeParams(note.id));

		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Note deleted" });

		const deletedNote = await Note.findById(note.id);
		expect(deletedNote).toBeNull();
	});

	it("should return 401 when unauthenticated", async () => {
		const { auth } = require("@/auth");
		auth.mockResolvedValueOnce(null);

		const res = await DELETE(makeReq(), makeParams(fakeId));

		expect(res.status).toBe(401);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Unauthorized" });
	});

	it("should return 404 when note not found", async () => {
		const res = await DELETE(makeReq(), makeParams(fakeId));

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Not found" });
	});

	it("should return 404 when note belongs to another user", async () => {
		const note = await Note.create({ title: "Note 1", content: "Content 1", userId: "other_user" });

		const res = await DELETE(makeReq(), makeParams(note.id));

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Not found" });
	});

	it("should return 500 on invalid id", async () => {
		const res = await DELETE(makeReq(), makeParams("-1"));

		expect(res.status).toBe(500);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Internal server error" });
	});
});
