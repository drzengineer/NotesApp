import { render, screen } from "@testing-library/react";
import NotesNotFound from "./NotesNotFound";

describe("NotesNotFound", () => {
	it("renders a link to create a new note", () => {
		// 1. render the component
		render(<NotesNotFound />);
		// 2. query for the link by role and its visible text
		// 3. assert it's in the document
		const result = screen.getByRole("link", { name: "Create Your First Note" });
		// 4. assert its href is correct
		expect(result).toHaveAttribute("href", "/create");
	});
});
