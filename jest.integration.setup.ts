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
	jest.spyOn(console, "error").mockImplementation(() => {});
	jest.spyOn(console, "warn").mockImplementation(() => {});
});

jest.mock("next/cache", () => ({
	revalidatePath: jest.fn(),
}));

jest.mock("@/lib/db", () => jest.fn().mockResolvedValue(undefined));
