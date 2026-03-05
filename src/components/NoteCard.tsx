"use client";

import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { INote } from "@/lib/Note";

interface NoteCardProps {
	note: INote;
}

export default function NoteCard({ note }: NoteCardProps) {
	const router = useRouter();

	const handleDelete = async (e: React.MouseEvent) => {
		e.preventDefault(); // prevent Link navigation
		if (!window.confirm("Are you sure you want to delete this note?")) return;

		try {
			const res = await fetch(`/api/notes/${note._id}`, { method: "DELETE" });
			if (res.status === 429) {
				toast.error("Slow down! You're too fast.", {
					duration: 4000,
					icon: "💀",
				});
				return;
			}
			if (!res.ok) throw Error("Failed to delete");
			toast.success("Note deleted");
			router.refresh(); // re-fetches home page server data
		} catch {
			toast.error("Failed to delete note");
		}
	};

	return (
		<Link data-testid="note-card" href={`/notes/${note._id}`}>
			<div className="card hover:shadow-lg transition-all duration-200 border-y border-gradient-blue-cyan border-transparent">
				<div className="card-body">
					<div className="flex items-start justify-between gap-2">
						<h2 className="card-title text-lg line-clamp-1">{note.title}</h2>
						<button
							data-testid="delete-button"
							aria-label="Delete note"
							type="button"
							onClick={handleDelete}
							className="btn btn-ghost btn-xs text-error"
						>
							<Trash2Icon className="size-4" />
						</button>
					</div>
					<p className="text-base-content/70 line-clamp-3 text-sm">{note.content}</p>
					<div className="card-actions justify-end mt-2">
						<span className="text-xs text-base-content/50">
							{new Date(note.createdAt).toLocaleDateString()}
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
