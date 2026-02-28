import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// 💡 WHY LAYOUT.TSX?
// This is your app's persistent shell — like your old index.html + the wrapper
// div in App.tsx. It wraps every page automatically. You only define it once.
// The {children} slot is where each page renders.

export const metadata: Metadata = {
	title: "Notes App",
	description: "A simple notes app",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" data-theme="forest">
			<body>
				{/* 💡 The radial gradient background from your App.tsx, now applied globally */}
				<div className="fixed inset-0 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#131313_60%,#135ffb70_100%)]" />
				<div className="relative h-full min-h-screen">{children}</div>
				{/* 💡 Toaster lives here once, available on every page */}
				<Toaster />
			</body>
		</html>
	);
}
