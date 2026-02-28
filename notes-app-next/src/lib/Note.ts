import mongoose from "mongoose";

export interface INote {
	_id: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

const noteSchema = new mongoose.Schema<INote>(
	{
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

const Note = mongoose.models.Note || mongoose.model<INote>("Note", noteSchema);

export default Note;
