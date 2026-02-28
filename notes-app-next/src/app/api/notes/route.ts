import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/lib/Note";

export async function GET(_req: NextRequest) {
	try {
		await connectDB();
		const notes = await Note.find().sort({ createdAt: -1 });
		return NextResponse.json(notes, { status: 200 });
	} catch (error) {
		console.error("Error in GET /api/notes/", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		await connectDB();
		const { title, content } = await req.json();
		const note = new Note({ title, content });
		const savedNote = await note.save();
		return NextResponse.json(savedNote, { status: 201 });
	} catch (error) {
		console.error("Error in POST /api/notes/", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}
