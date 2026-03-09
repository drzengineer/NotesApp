import { LogInIcon, NotebookPenIcon } from "lucide-react";

const SignInPrompt = () => {
	return (
		<div
			data-testid="sign-in-prompt"
			className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center"
		>
			<div className="bg-primary/10 rounded-full p-8">
				<NotebookPenIcon className="size-10 text-primary" />
			</div>
			<h3 className="text-2xl font-bold">Welcome to Notes</h3>
			<p className="text-base-content/70">
				Sign in with Google or GitHub to create and manage your personal notes securely.
			</p>
			<a
				href="/api/auth/signin"
				className="btn text-primary-content bg-linear-to-r from-blue-600 to-cyan-500"
			>
				<LogInIcon className="size-4" />
				Sign In to Get Started
			</a>
		</div>
	);
};

export default SignInPrompt;
