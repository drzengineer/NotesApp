"use client";

import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import type { INote } from "@/lib/Note";
import { validateNote } from "@/utils/validators";

export default function NoteDetailPage() {
	const [note, setNote] = useState<INote | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const router = useRouter();
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		const fetchNote = async () => {
			try {
				const res = await fetch(`/api/notes/${id}`);
				if (res.status === 429) {
					toast.error("Slow down! You're too fast.", {
						duration: 4000,
						icon: "💀",
					});
					return;
				}
				if (!res.ok) throw new Error("Failed to fetch note");
				const data = await res.json();
				setNote(data);
			} catch (error) {
				console.error("Error fetching note", error);
				toast.error("Failed to fetch note");
			} finally {
				setLoading(false);
			}
		};

		fetchNote();
	}, [id]);

	const handleDelete = async () => {
		if (!window.confirm("Are you sure you want to delete this note?")) return;

		try {
			const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
			if (res.status === 429) {
				toast.error("Slow down! You're too fast.", {
					duration: 4000,
					icon: "💀",
				});
				return;
			}
			if (!res.ok) throw new Error("Failed to delete note");
			toast.success("Note deleted successfully");
			router.push("/");
		} catch (error) {
			console.error("Error deleting note:", error);
			toast.error("Failed to delete note");
		}
	};

	const handleSave = async () => {
		if (!note) return;
		const validation = validateNote(note.title, note.content);
		if (!validation.valid) {
			toast.error(validation.message);
			return;
		}

		setSaving(true);
		try {
			const res = await fetch(`/api/notes/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title: note.title, content: note.content }),
			});
			if (res.status === 429) {
				toast.error("Slow down! You're too fast.", {
					duration: 4000,
					icon: "💀",
				});
				return;
			}
			if (!res.ok) throw new Error("Failed to save note");
			toast.success("Note updated successfully");
			router.push("/");
			setTimeout(() => router.refresh(), 100);
		} catch (error) {
			console.error("Error updating note:", error);
			toast.error("Failed to save note");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-base-300 flex items-center justify-center">
				<LoaderIcon className="animate-spin size-10" />
			</div>
		);
	}

	if (!note) return null;

	return (
		<div data-testid="selected-note" className="min-h-screen relative bg-base-300">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-2xl mx-auto">
					<div className="flex items-center justify-between mb-6">
						<Link data-testid="back-button" href="/" className="btn btn-ghost">
							<ArrowLeftIcon className="size-5" />
							Back to Notes
						</Link>
						<button
							data-testid="delete-button"
							type="button"
							onClick={handleDelete}
							className="btn btn-error btn-outline"
						>
							<Trash2Icon className="size-5" />
							Delete Note
						</button>
					</div>
					<div className="card border border-gradient-blue-cyan border-transparent">
						<div className="card-body">
							<fieldset className="fieldset mb-4">
								<legend className="fieldset-legend">Title</legend>
								<input
									data-testid="title-input"
									type="text"
									placeholder="Note title"
									className="input w-auto bg-linear-to-r from-[#131313] to-[#151515] focus:outline-none"
									value={note.title}
									onChange={(e) => setNote({ ...note, title: e.target.value })}
								/>
							</fieldset>
							<fieldset className="fieldset mb-4">
								<legend className="fieldset-legend">Content</legend>
								<textarea
									data-testid="content-input"
									placeholder="Write your note here..."
									className="textarea textarea-bordered h-32 w-auto bg-linear-to-r from-[#131313] to-[#151515] focus:outline-none"
									value={note.content}
									onChange={(e) => setNote({ ...note, content: e.target.value })}
								/>
							</fieldset>
							<div className="card-actions justify-end">
								<button
									data-testid="save-note-button"
									type="button"
									className="btn border-2 border-solid btn-border-gradient-blue-cyan border-transparent"
									disabled={saving}
									onClick={handleSave}
								>
									{saving ? "Saving..." : "Save Changes"}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
