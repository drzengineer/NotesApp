import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod: MongoMemoryServer;

beforeAll(async () => {
	mongod = await MongoMemoryServer.create();
	await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongod.stop();
});

beforeEach(async () => {
	await mongoose.connection.dropDatabase();
});

jest.mock("next/cache", () => ({
	revalidatePath: jest.fn(),
}));

jest.mock("@/lib/db", () => ({
	connectDB: jest.fn().mockResolvedValue(undefined),
}));

beforeEach(() => {
	jest.spyOn(console, "error").mockImplementation(() => {});
});
