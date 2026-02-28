import { NotebookIcon } from "lucide-react";
import Link from "next/link";

const NotesNotFound = () => {
	return (
		<div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center">
			<div className="bg-primary/10 rounded-full p-8">
				<NotebookIcon className="size-10 text-primary" />
			</div>
			<h3 className="text-2xl font-bold">No notes yet</h3>
			<p className="text-base-content/70">
				Ready to organize your thoughts? Create your first note to get started
				on your journey.
			</p>
			<Link
				href="/create"
				className="btn text-primary-content bg-linear-to-r from-blue-600 to-cyan-500"
			>
				Create Your First Note
			</Link>
		</div>
	);
};
export default NotesNotFound;
