import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Note from "@/lib/Note";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const session = await auth();
	if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	await dbConnect();

	const note = await Note.findById(id);
	if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });

	if (note.userId !== session.user.id) {
		console.warn(`User ${session.user.id} attempted to access note ${id}`);
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	return NextResponse.json(note);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const session = await auth();
	if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	await dbConnect();

	const note = await Note.findById(id);
	if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });

	if (note.userId !== session.user.id) {
		console.warn(`User ${session.user.id} attempted to update note ${id}`);
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	const body = await request.json();
	const updated = await Note.findByIdAndUpdate(id, body, { new: true });
	return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const session = await auth();
	if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	await dbConnect();

	const note = await Note.findById(id);
	if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });

	if (note.userId !== session.user.id) {
		console.warn(`User ${session.user.id} attempted to delete note ${id}`);
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	await note.deleteOne();
	return NextResponse.json({ message: "Note deleted" });
}
