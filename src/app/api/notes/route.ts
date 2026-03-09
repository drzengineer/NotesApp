import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Note from "@/lib/Note";

export async function GET() {
	try {
		const session = await auth();
		if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		await connectDB();
		const notes = await Note.find({ userId: session.user.id });
		return NextResponse.json(notes);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const session = await auth();
		if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		await connectDB();
		const body = await request.json();

		const note = await Note.create({
			title: body.title,
			content: body.content,
			userId: session.user.id,
		});

		return NextResponse.json(note, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
