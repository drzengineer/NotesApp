export function validateNote(title: string, content: string): { valid: boolean; message: string } {
	if (!title.trim() || !content.trim()) {
		return { valid: false, message: "All fields are required" };
	}
	return { valid: true, message: "" };
}
