import mongoose from "mongoose";

declare global {
	var _mongoose: {
		conn: typeof mongoose | null;
		promise: Promise<typeof mongoose> | null;
	};
}

let cached = global._mongoose;

if (!cached) {
	cached = global._mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
	const MONGO_URI =
		process.env.NEXT_PUBLIC_IS_TEST === "true" ? process.env.TEST_MONGO_URI : process.env.MONGO_URI;

	if (!MONGO_URI) {
		throw new Error("Please define the MONGO_URI environment variable in .env.local");
	}

	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
	}

	cached.conn = await cached.promise;
	return cached.conn;
}
