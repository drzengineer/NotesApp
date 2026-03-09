"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { validateNote } from "@/utils/validators";

export default function CreatePage() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const handleCreate = async () => {
		const validation = validateNote(title, content);
		if (!validation.valid) {
			toast.error(validation.message);
			return;
		}

		setLoading(true);

		try {
			const res = await fetch("/api/notes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, content }),
			});

			if (res.status === 429) {
				toast.error("Slow down! You're too fast.", {
					duration: 4000,
					icon: "💀",
				});
				return;
			}
			if (!res.ok) throw new Error("Failed to create note");

			toast.success("Note created successfully");
			router.push("/");
		} catch (error) {
			console.error("Error creating note", error);
			toast.error("Failed to create note");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative min-h-screen bg-base-300">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-2xl mx-auto">
					<Link data-testid="back-button" href="/" className="btn btn-ghost mb-6">
						<ArrowLeftIcon className="size-5" />
						Back to Notes
					</Link>
					<div className="card border border-gradient-blue-cyan border-transparent">
						<div className="card-body">
							<h2 className="card-title text-2xl mb-4">Create New Note</h2>
							<fieldset className="fieldset mb-4">
								<legend className="fieldset-legend">Title</legend>
								<input
									data-testid="title-input"
									type="text"
									className="input w-auto bg-linear-to-r from-[#131313] to-[#151515] focus:outline-none"
									placeholder="Note Title"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</fieldset>
							<fieldset className="fieldset mb-4">
								<legend className="fieldset-legend">Content</legend>
								<textarea
									data-testid="content-input"
									placeholder="Write your note here..."
									className="textarea textarea-bordered h-32 w-auto bg-linear-to-r from-[#131313] to-[#151515] focus:outline-none"
									value={content}
									onChange={(e) => setContent(e.target.value)}
								/>
							</fieldset>
							<div className="card-actions justify-end">
								<button
									data-testid="create-note-button"
									type="button"
									className="btn border-2 border-solid btn-border-gradient-blue-cyan border-transparent"
									disabled={loading}
									onClick={handleCreate}
								>
									{loading ? "Creating..." : "Create Note"}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
