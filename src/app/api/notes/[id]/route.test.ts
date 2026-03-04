/** @jest-environment node */
/** biome-ignore-all lint/suspicious/noExplicitAny: Too verbose for test file */

import type { NextRequest } from "next/server";
import { DELETE, GET, PUT } from "@/app/api/notes/[id]/route";
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

const mockNote = { _id: "2", title: "Note 1", content: "Content 1", createdAt: new Date() };
const mockReq = new Request("http://localhost/api/notes/[id]") as unknown as NextRequest;
const mockParams = { params: Promise.resolve({ id: "2" }) };

const mockPutNote = {
	_id: "2",
	title: "Updated Note",
	content: "Updated Content",
	createdAt: new Date(),
};

describe("GET /api/notes/[id]", () => {
	it("should return note with status 200", async () => {
		jest.spyOn(Note, "findById").mockResolvedValue(mockNote as any);
		const res = await GET(mockReq, mockParams);

		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toMatchObject({ _id: "2", title: "Note 1", content: "Content 1" });
	});

	it("should return status 404", async () => {
		jest.spyOn(Note, "findById").mockResolvedValue(null);
		const res = await GET(mockReq, mockParams);

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Note not found" });
	});

	it("should return status 500", async () => {
		jest.spyOn(Note, "findById").mockRejectedValue(new Error("DB error"));
		const res = await GET(mockReq, mockParams);

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

	it("should update a note with status 200", async () => {
		jest.spyOn(Note, "findByIdAndUpdate").mockResolvedValue(mockPutNote as any);
		const res = await PUT(makePutReq(), mockParams);

		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toMatchObject({ _id: "2", title: "Updated Note", content: "Updated Content" });
	});

	it("should return status 404", async () => {
		jest.spyOn(Note, "findByIdAndUpdate").mockResolvedValue(null);
		const res = await PUT(makePutReq(), mockParams);

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Note not found" });
	});

	it("should return status 500", async () => {
		jest.spyOn(Note, "findByIdAndUpdate").mockRejectedValue(new Error("DB error"));
		const res = await PUT(makePutReq(), mockParams);

		expect(res.status).toBe(500);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Internal server error" });
	});
});
describe("DELETE /api/notes/[id]", () => {
	it("should delete note with status 200", async () => {
		jest.spyOn(Note, "findByIdAndDelete").mockResolvedValue(mockNote as any);
		const res = await DELETE(mockReq, mockParams);

		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toMatchObject({ _id: "2", title: "Note 1", content: "Content 1" });
	});

	it("should return status 404", async () => {
		jest.spyOn(Note, "findByIdAndDelete").mockResolvedValue(null);
		const res = await DELETE(mockReq, mockParams);

		expect(res.status).toBe(404);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Note not found" });
	});

	it("should return status 500", async () => {
		jest.spyOn(Note, "findByIdAndDelete").mockRejectedValue(new Error("DB error"));
		const res = await DELETE(mockReq, mockParams);

		expect(res.status).toBe(500);
		const data = await res.json();
		expect(data).toMatchObject({ message: "Internal server error" });
	});
});
