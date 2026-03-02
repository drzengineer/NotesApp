import { formatNote } from "./formatNote";

describe("formatNote", () => {
	it("should convert numbers to strings and return an INote", () => {
		const result = formatNote({
			_id: "12345",
			title: "the title",
			content: "the content",
			createdAt: 3883,
			updatedAt: 4324,
		});
		expect(result).toEqual({
			_id: "12345",
			title: "the title",
			content: "the content",
			createdAt: "3883",
			updatedAt: "4324",
		});
	});

	it("should convert Dates to strings and return an INote", () => {
		const result = formatNote({
			_id: "758402y54bfn9r3of",
			title: "the title",
			content: "the content",
			createdAt: new Date("2024-01-15"),
			updatedAt: new Date("2024-01-16"),
		});
		expect(result).toEqual({
			_id: "758402y54bfn9r3of",
			title: "the title",
			content: "the content",
			createdAt: String(new Date("2024-01-15")),
			updatedAt: String(new Date("2024-01-16")),
		});
	});
});
