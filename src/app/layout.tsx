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
				{/* The radial gradient background*/}
				<div className="fixed inset-0 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#131313_60%,#135ffb70_100%)]" />

				<SessionWrapper>
					<div className="relative h-full min-h-screen">{children}</div>
				</SessionWrapper>

				<Toaster />
			</body>
		</html>
	);
}
