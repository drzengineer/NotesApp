import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";

export const metadata: Metadata = {
	title: "Notes App",
	description: "A simple notes app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" data-theme="forest">
			<body>
				{/* z-0 ensures this never overlaps toasts or modals */}
				<div className="fixed inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#111_60%,#135ffb30_100%)]" />

				<SessionWrapper>
					<div className="relative h-full min-h-screen">{children}</div>
					{/* Toaster inside SessionWrapper so it shares the stacking context */}
					<Toaster />
				</SessionWrapper>
			</body>
		</html>
	);
}
