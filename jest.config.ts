import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const unitConfig = {
	displayName: "unit",
	testMatch: ["**/*.test.ts", "**/*.test.tsx"],
	testPathIgnorePatterns: ["\\.integration\\.test\\.ts$"],
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
};

const integrationConfig = {
	displayName: "integration",
	testMatch: ["**/*.integration.test.ts"],
	testEnvironment: "node",
	setupFilesAfterEnv: ["<rootDir>/jest.integration.setup.ts"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
};

const config: Config = {
	clearMocks: true,
	restoreMocks: true,
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",
	projects: [await createJestConfig(unitConfig)(), await createJestConfig(integrationConfig)()],
};

export default config;
