/** @jest-environment node */
/** biome-ignore-all lint/suspicious/noExplicitAny: Too verbose for test file */

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

jest.mock("@/lib/db", () => jest.fn().mockResolvedValue(undefined));

jest.mock("next/cache", () => ({
	revalidatePath: jest.fn(),
}));

beforeEach(() => {
	jest.spyOn(console, "error").mockImplementation(() => {});
	jest.spyOn(console, "warn").mockImplementation(() => {});
});

const mockNote = {
	_id: "2",
	title: "Note 1",
	content: "Content 1",
	userId: "user_123",
	createdAt: new Date(),
	deleteOne: jest.fn().mockResolvedValue(undefined),
};

const mockReq = new Request("http://localhost/api/notes/2");
const mockParams = { params: Promise.resolve({ id: "2" }) };

describe("GET /api/notes/[id]", () => {
	it("should return note with status 200", async () => {
		jest.spyOn(Note, "findById").mockResolvedValue(mockNote as any);

		const res = await GET(mockReq, mockParams);

		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toMatchObject({ _id: "2", title: "Note 1", content: "Content 1" });
	});

	it("should return 401 when unauthenticated", async () => {
		const { auth } = require("@/auth");
		auth.mockResolvedValueOnce(null);

		const res = await GET(mockReq, mockParams);

		expect(res.status).toBe(401);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Unauthorized" });
	});

	it("should return 404 when note does not exist", async () => {
		jest.spyOn(Note, "findById").mockResolvedValue(null);

		const res = await GET(mockReq, mockParams);

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Not found" });
	});

	it("should return 404 when note belongs to another user", async () => {
		jest.spyOn(Note, "findById").mockResolvedValue({ ...mockNote, userId: "other_user" } as any);

		const res = await GET(mockReq, mockParams);

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Not found" });
	});

	it("should return 500 on error", async () => {
		jest.spyOn(Note, "findById").mockRejectedValue(new Error("DB error"));

		const res = await GET(mockReq, mockParams);

		expect(res.status).toBe(500);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Internal server error" });
	});
});

describe("PUT /api/notes/[id]", () => {
	const makePutReq = () =>
		new Request("http://localhost/api/notes/2", {
			method: "PUT",
			body: JSON.stringify({ title: "Updated Note", content: "Updated Content" }),
		});

	const mockUpdatedNote = {
		_id: "2",
		title: "Updated Note",
		content: "Updated Content",
		userId: "user_123",
		createdAt: new Date(),
	};

	it("should update a note with status 200", async () => {
		jest.spyOn(Note, "findById").mockResolvedValue(mockNote as any);
		jest.spyOn(Note, "findByIdAndUpdate").mockResolvedValue(mockUpdatedNote as any);

		const res = await PUT(makePutReq(), mockParams);

		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toMatchObject({ _id: "2", title: "Updated Note", content: "Updated Content" });
	});

	it("should return 401 when unauthenticated", async () => {
		const { auth } = require("@/auth");
		auth.mockResolvedValueOnce(null);

		const res = await PUT(makePutReq(), mockParams);

		expect(res.status).toBe(401);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Unauthorized" });
	});

	it("should return 404 when note does not exist", async () => {
		jest.spyOn(Note, "findById").mockResolvedValue(null);

		const res = await PUT(makePutReq(), mockParams);

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Not found" });
	});

	it("should return 404 when note belongs to another user", async () => {
		jest.spyOn(Note, "findById").mockResolvedValue({ ...mockNote, userId: "other_user" } as any);

		const res = await PUT(makePutReq(), mockParams);

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Not found" });
	});

	it("should return 500 on error", async () => {
		jest.spyOn(Note, "findById").mockRejectedValue(new Error("DB error"));

		const res = await PUT(makePutReq(), mockParams);

		expect(res.status).toBe(500);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Internal server error" });
	});
});

describe("DELETE /api/notes/[id]", () => {
	it("should delete note with status 200", async () => {
		jest.spyOn(Note, "findById").mockResolvedValue(mockNote as any);

		const res = await DELETE(mockReq, mockParams);

		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Note deleted" });
	});

	it("should return 401 when unauthenticated", async () => {
		const { auth } = require("@/auth");
		auth.mockResolvedValueOnce(null);

		const res = await DELETE(mockReq, mockParams);

		expect(res.status).toBe(401);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Unauthorized" });
	});

	it("should return 404 when note does not exist", async () => {
		jest.spyOn(Note, "findById").mockResolvedValue(null);

		const res = await DELETE(mockReq, mockParams);

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Not found" });
	});

	it("should return 404 when note belongs to another user", async () => {
		jest.spyOn(Note, "findById").mockResolvedValue({ ...mockNote, userId: "other_user" } as any);

		const res = await DELETE(mockReq, mockParams);

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ error: "Not found" });
	});

	it("should return 500 on error", async () => {
		jest.spyOn(Note, "findById").mockRejectedValue(new Error("DB error"));

		const res = await DELETE(mockReq, mockParams);

		expect(res.status).toBe(500);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Internal server error" });
	});
});
