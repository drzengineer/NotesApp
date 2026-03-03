import { PlusIcon } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
	return (
		<header className="bg-base-300 border-b border-base-content/10">
			<div className="mx-auto max-w-6xl p-4">
				<div className="flex items-center justify-between">
					<svg
						aria-label="David R logo"
						role="img"
						version="1.2"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 80 80"
						height="36"
					>
						<defs>
							<linearGradient id="logoGradFill" x1="0%" y1="0%" x2="100%" y2="100%">
								<stop className="svg-brand-from" offset="0%" stop-color="#22d3dd" />
								<stop className="svg-brand-to" offset="90%" stop-color="#135ffb" />
							</linearGradient>
							<linearGradient id="botLogoFill" x1="0%" y1="0%" x2="100%" y2="100%">
								<stop className="svg-brand-from" offset="40%" stop-color="#22d3dd" />
								<stop className="svg-brand-to" offset="100%" stop-color="#135ffb" />
							</linearGradient>
						</defs>
						<path
							fill="url(#logoGradFill)"
							d="m35.89 1.46h-11.1-23.32v21.88 11.09l7.78 7.17h22.2l-7.36-7.17v-12.05h11.8c6.1 0 10.81 6.03 10.81 12.13v0.04c0 6.1-4.71 11.57-10.81 11.57h-11.1-11.1-12.22v21.54l33.79 0.13c6.22 0 12.64-1.82 17.69-4.92 9.57-5.86 16.36-16.44 16.36-28.42v0.07c0-18.31-15.11-33.06-33.42-33.06z"
						/>
						<path
							className="svg-logo-accent"
							fill="#135ffb"
							d="m56.43 66.08l-0.91 0.54c-4.71 2.89-9.98 4.64-15.43 5.26l6.93 6.85h22.08c0-0.01-12.67-12.65-12.67-12.65z"
						/>
					</svg>
					<div className="flex items-center gap-4">
						<Link
							href={"/create"}
							className="btn border-3 border-solid nav-border-gradient-blue-cyan border-transparent"
						>
							<PlusIcon className="size-5" />
							<span>New Note</span>
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
};
export default Navbar;
