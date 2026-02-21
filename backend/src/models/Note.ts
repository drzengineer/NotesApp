import mongoose from "mongoose";

interface INote {
	title: string;
	content: string;
	createdAt?: Date;
	updatedAt?: Date;
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

const Note = mongoose.model<INote>("Note", noteSchema);

export default Note;
