import Navbar from "@/components/Navbar";
import NoteCard from "@/components/NoteCard";
import NotesNotFound from "@/components/NotesNotFound";
import { connectDB } from "@/lib/db";
import Note, { type INote } from "@/lib/Note";

export default async function HomePage() {
	let notes: INote[] = [];

	try {
		await connectDB();
		const rawNotes = await Note.find().sort({ createdAt: -1 }).lean();
		notes = rawNotes.map((n) => ({
			...n,
			_id: String(n._id),
			createdAt: String(n.createdAt),
			updatedAt: String(n.updatedAt),
		})) as INote[];
	} catch (error) {
		console.error("Error fetching notes:", error);
	}

	return (
		<div className="relative">
			<Navbar />

			<div className="max-w-6xl mx-auto p-4 mt-6">
				{notes.length === 0 && <NotesNotFound />}

				{notes.length > 0 && (
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
