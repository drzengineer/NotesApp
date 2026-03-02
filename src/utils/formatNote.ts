import type { INote } from "@/lib/Note";

export function formatNote(raw: {
	_id: unknown;
	title: string;
	content: string;
	createdAt: unknown;
	updatedAt: unknown;
}): INote {
	return {
		_id: String(raw._id),
		title: raw.title,
		content: raw.content,
		createdAt: String(raw.createdAt),
		updatedAt: String(raw.updatedAt),
	};
}
