import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signOut, useSession } from "next-auth/react";

jest.mock("next-auth/react", () => ({
	useSession: jest.fn(),
	signOut: jest.fn(),
}));

jest.mock("@/auth", () => ({
	auth: jest.fn(),
	handlers: {},
	signIn: jest.fn(),
	signOut: jest.fn(),
}));

import Navbar from "./Navbar";

const mockUseSession = useSession as jest.Mock;
const mockSignOut = signOut as jest.Mock;

describe("Navbar", () => {
	it("renders the logo", () => {
		mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
		render(<Navbar />);
		expect(screen.getByRole("img", { name: /david r logo/i })).toBeInTheDocument();
	});

	describe("when authenticated", () => {
		beforeEach(() => {
			mockUseSession.mockReturnValue({
				data: { user: { name: "Test User" } },
				status: "authenticated",
			});
		});

		it("renders a link to create a new note", () => {
			render(<Navbar />);
			const result = screen.getByRole("link", { name: /new note/i });
			expect(result).toHaveAttribute("href", "/create");
		});

		it("renders a greeting with the user's name", () => {
			render(<Navbar />);
			expect(screen.getByText(/hi, test user/i)).toBeInTheDocument();
		});

		it("renders a sign out button", () => {
			render(<Navbar />);
			expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
		});

		it("calls signOut when the sign out button is clicked", async () => {
			render(<Navbar />);
			await userEvent.click(screen.getByRole("button", { name: /sign out/i }));
			expect(mockSignOut).toHaveBeenCalledTimes(1);
		});
	});

	describe("when loading", () => {
		beforeEach(() => {
			mockUseSession.mockReturnValue({ data: null, status: "loading" });
		});

		it("does not render the new note link", () => {
			render(<Navbar />);
			expect(screen.queryByRole("link", { name: /new note/i })).not.toBeInTheDocument();
		});

		it("does not render the sign out button", () => {
			render(<Navbar />);
			expect(screen.queryByRole("button", { name: /sign out/i })).not.toBeInTheDocument();
		});
	});

	describe("when unauthenticated", () => {
		beforeEach(() => {
			mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
		});

		it("does not render the new note link", () => {
			render(<Navbar />);
			expect(screen.queryByRole("link", { name: /new note/i })).not.toBeInTheDocument();
		});

		it("does not render the sign out button", () => {
			render(<Navbar />);
			expect(screen.queryByRole("button", { name: /sign out/i })).not.toBeInTheDocument();
		});
	});
});
