import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";

describe("Navbar", () => {
	it("renders a link to create a new note", () => {
		// 1. render the component
		render(<Navbar />);
		// 2. query for the link by role and its visible text
		// 3. assert it's in the document
		const result = screen.getByRole("link", { name: "New Note" });
		// 4. assert its href is correct
		expect(result).toHaveAttribute("href", "/create");
	});
});
