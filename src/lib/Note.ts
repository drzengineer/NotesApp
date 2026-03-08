import mongoose from "mongoose";

export interface INote {
	_id: string;
	title: string;
	content: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}

const NoteSchema = new mongoose.Schema<INote>(
	{
		title: { type: String, required: true },
		content: { type: String, required: true },
		userId: {
			type: String,
			required: true, // every note must have an owner
			index: true, // speeds up queries like Note.find({ userId })
		},
	},
	{ timestamps: true }, // auto manages createdAt and updatedAt
);

export default mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);
