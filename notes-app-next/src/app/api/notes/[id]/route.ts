import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/lib/Note";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
	try {
		await connectDB();
		const { id } = await params;
		const note = await Note.findById(id);
		if (!note)
			return NextResponse.json({ message: "Note not found" }, { status: 404 });
		return NextResponse.json(note, { status: 200 });
	} catch (error) {
		console.error("Error in GET /api/notes/[id]", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function PUT(req: NextRequest, { params }: Params) {
	try {
		await connectDB();
		const { id } = await params;
		const { title, content } = await req.json();
		const updatedNote = await Note.findByIdAndUpdate(
			id,
			{ title, content },
			{ new: true },
		);
		if (!updatedNote)
			return NextResponse.json({ message: "Note not found" }, { status: 404 });
		return NextResponse.json(updatedNote, { status: 200 });
	} catch (error) {
		console.error("Error in PUT /api/notes/[id]", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(_req: NextRequest, { params }: Params) {
	try {
		await connectDB();
		const { id } = await params;
		const deletedNote = await Note.findByIdAndDelete(id);
		if (!deletedNote)
			return NextResponse.json({ message: "Note not found" }, { status: 404 });
		return NextResponse.json(deletedNote, { status: 200 });
	} catch (error) {
		console.error("Error in DELETE /api/notes/[id]", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}
