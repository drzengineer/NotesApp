import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Note from "@/lib/Note";

export async function GET() {
	const session = await auth(); // gets current session server side

	// middleware already blocks unauthenticated requests
	// but we double check here as a second layer of defense
	if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	await dbConnect();

	// only fetch notes belonging to this user — never expose other users' notes
	const notes = await Note.find({ userId: session.user.id });
	return NextResponse.json(notes);
}

export async function POST(request: Request) {
	const session = await auth();

	if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	await dbConnect();

	const body = await request.json();

	const note = await Note.create({
		title: body.title,
		content: body.content,
		userId: session.user.id, // ALWAYS from session, never from request body — prevents forgery
	});

	return NextResponse.json(note, { status: 201 });
}
