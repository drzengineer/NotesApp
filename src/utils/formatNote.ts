import type { INote } from "@/lib/Note";

export function formatNote(raw: {
	_id: unknown;
	title: string;
	content: string;
	userId: string;
	createdAt: unknown;
	updatedAt: unknown;
}): INote {
	return {
		_id: String(raw._id),
		title: raw.title,
		content: raw.content,
		userId: raw.userId,
		createdAt: new Date(raw.createdAt as string),
		updatedAt: new Date(raw.updatedAt as string),
	};
}
