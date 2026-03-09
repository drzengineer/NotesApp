import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import NoteCard from "@/components/NoteCard";
import NotesNotFound from "@/components/NotesNotFound";
import SignInPrompt from "@/components/SignInPrompt";
import connectDB from "@/lib/db";
import Note, { type INote } from "@/lib/Note";
import { formatNote } from "@/utils/formatNote";

export const dynamic = "force-dynamic";

export default async function HomePage() {
	const session = await auth();

	let notes: INote[] = [];

	if (session) {
		try {
			await connectDB();
			const rawNotes = await Note.find({ userId: session.user.id })
				.sort({ createdAt: -1 })
				.lean<INote[]>();
			notes = rawNotes.map((n) => formatNote(n));
		} catch (error) {
			console.error("Error fetching notes:", error);
		}
	}

	return (
		<div className="relative">
			<Navbar />
			<div className="max-w-6xl mx-auto p-4 mt-6">
				{!session && <SignInPrompt />}
				{session && notes.length === 0 && <NotesNotFound />}
				{session && notes.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{notes.map((note) => (
							<NoteCard key={note._id} note={note} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
