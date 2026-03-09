import mongoose from "mongoose";

declare global {
	var _mongoose: {
		conn: typeof mongoose | null;
		promise: Promise<typeof mongoose> | null;
	};
}

// Evaluated inside the function so env vars are always fresh
function getMongoURI(): string {
	const uri = process.env.IS_TEST === "true" ? process.env.TEST_MONGO_URI : process.env.MONGO_URI;

	if (!uri) {
		throw new Error(
			process.env.IS_TEST === "true" ? "TEST_MONGO_URI is not defined" : "MONGO_URI is not defined",
		);
	}

	return uri;
}

if (!global._mongoose) {
	global._mongoose = { conn: null, promise: null };
}

const cached = global._mongoose;

export default async function connectDB(): Promise<typeof mongoose> {
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		cached.promise = mongoose
			.connect(getMongoURI(), {
				bufferCommands: false, // fail fast instead of silently queuing
			})
			.catch((err) => {
				// Clear the cached promise so the next call retries
				cached.promise = null;
				throw err;
			});
	}

	cached.conn = await cached.promise;
	return cached.conn;
}
