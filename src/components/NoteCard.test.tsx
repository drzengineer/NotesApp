import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import NoteCard from "./NoteCard";

jest.mock("next/navigation", () => ({
	useRouter: jest.fn(() => ({ refresh: jest.fn() })),
}));

jest.mock("react-hot-toast", () => ({
	error: jest.fn(),
	success: jest.fn(),
}));

describe("NoteCard", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
		window.confirm = jest.fn();
	});

	const mockNote = {
		_id: "507f1f77bcf86cd799439011",
		title: "Test Title",
		content: "Test content",
		createdAt: "2024-01-15T00:00:00.000Z",
		updatedAt: "2024-01-15T00:00:00.000Z",
	};

	it("renders correctly", () => {
		render(<NoteCard note={mockNote} />);

		const link = screen.getByRole("link");
		screen.getByRole("heading", { level: 2, name: "Test Title" });
		screen.getByText("Test content");
		screen.getByText(new Date("2024-01-15T00:00:00.000Z").toLocaleDateString());
		screen.getByRole("button", { name: "Delete note" });

		expect(link).toHaveAttribute("href", `/notes/${mockNote._id}`);
	});

	it("should not call fetch after user clicks delete and then cancels on confirm window", async () => {
		render(<NoteCard note={mockNote} />);

		window.confirm = jest.fn(() => false);

		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: "Delete note" }));

		expect(global.fetch).not.toHaveBeenCalled();
	});

	it("should call fetch and return ok when user clicks delete and confirms", async () => {
		const mockRefresh = jest.fn();
		(useRouter as jest.Mock).mockReturnValue({ refresh: mockRefresh });

		render(<NoteCard note={mockNote} />);

		window.confirm = jest.fn(() => true);
		(global.fetch as jest.Mock).mockResolvedValue({ ok: true, status: 200 });

		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: "Delete note" }));

		expect(global.fetch).toHaveBeenCalledWith(`/api/notes/${mockNote._id}`, { method: "DELETE" });
		expect(toast.success).toHaveBeenCalled();
		expect(mockRefresh).toHaveBeenCalled();
	});

	it("should call fetch and be ratelimited when user clicks delete and confirms", async () => {
		const mockRefresh = jest.fn();
		(useRouter as jest.Mock).mockReturnValue({ refresh: mockRefresh });

		render(<NoteCard note={mockNote} />);

		window.confirm = jest.fn(() => true);
		(global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 429 });

		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: "Delete note" }));

		expect(global.fetch).toHaveBeenCalledWith(`/api/notes/${mockNote._id}`, { method: "DELETE" });
		expect(toast.error).toHaveBeenCalledWith("Slow down! You're too fast.", {
			duration: 4000,
			icon: "💀",
		});
		expect(mockRefresh).not.toHaveBeenCalled();
	});

	it("should call fetch and throw an error", async () => {
		const mockRefresh = jest.fn();
		(useRouter as jest.Mock).mockReturnValue({ refresh: mockRefresh });

		render(<NoteCard note={mockNote} />);

		window.confirm = jest.fn(() => true);
		(global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 404 });

		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: "Delete note" }));

		expect(global.fetch).toHaveBeenCalledWith(`/api/notes/${mockNote._id}`, { method: "DELETE" });
		expect(toast.error).toHaveBeenCalledWith("Failed to delete note");
		expect(mockRefresh).not.toHaveBeenCalled();
	});
});
