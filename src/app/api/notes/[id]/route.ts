import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Note from "@/lib/Note";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const session = await auth();
		if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		await connectDB();

		const note = await Note.findById(id);
		if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });

		if (note.userId !== session.user.id) {
			console.warn(`User ${session.user.id} attempted to access note ${id}`);
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		return NextResponse.json(note);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const session = await auth();
		if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		await connectDB();

		const note = await Note.findById(id);
		if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });

		if (note.userId !== session.user.id) {
			console.warn(`User ${session.user.id} attempted to update note ${id}`);
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		const body = await request.json();
		const updated = await Note.findByIdAndUpdate(id, body, { returnDocument: "after" });
		return NextResponse.json(updated);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const session = await auth();
		if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		await connectDB();

		const note = await Note.findById(id);
		if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });

		if (note.userId !== session.user.id) {
			console.warn(`User ${session.user.id} attempted to delete note ${id}`);
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		await note.deleteOne();
		return NextResponse.json({ message: "Note deleted" });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
