import { validateNote } from "./validators";

describe("validateNote", () => {
	it("should return invalid when both strings are empty", () => {
		const result = validateNote("", "");
		expect(result.valid).toBe(false);
		expect(result.message).toBe("All fields are required");
	});
	it("should return invalid when the title is empty", () => {
		const result = validateNote("", "some content");
		expect(result.valid).toBe(false);
		expect(result.message).toBe("All fields are required");
	});

	it("should return invalid when the content is empty", () => {
		const result = validateNote("a title", "");
		expect(result.valid).toBe(false);
		expect(result.message).toBe("All fields are required");
	});

	it("should return valid when title and content are filled", () => {
		const result = validateNote("a title", "some content");
		expect(result.valid).toBe(true);
		expect(result.message).toBe("");
	});
});
