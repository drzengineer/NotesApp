/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { proxy, requests } from "./proxy";

describe("proxy", () => {
	beforeEach(() => {
		requests.clear();
		jest.spyOn(Date, "now").mockReturnValue(1000);
	});

	it("should let the ip passthrough on first try", () => {
		const req = new Request("http://localhost/api/notes", {
			headers: { "x-forwarded-for": "1.2.3.4" },
		});
		const nextReq = new NextRequest(req);

		const result = proxy(nextReq);
		expect(result.status).toBe(200);
	});

	it("should let the ip passthrough on consecutive tries under the threshhold", () => {
		const req = new Request("http://localhost/api/notes", {
			headers: { "x-forwarded-for": "1.2.3.4" },
		});
		const nextReq = new NextRequest(req);

		let result = proxy(nextReq);
		for (let i = 0; i < 9; i++) {
			result = proxy(nextReq);
		}
		expect(result.status).toBe(200);
	});

	it("should let the ip address passthrough after window passes", () => {
		const req = new Request("http://localhost/api/notes", {
			headers: { "x-forwarded-for": "1.2.3.4" },
		});
		const nextReq = new NextRequest(req);

		let result = proxy(nextReq);
		jest.spyOn(Date, "now").mockReturnValue(11001);
		result = proxy(nextReq);
		expect(result.status).toBe(200);
	});

	it("should ratelimit the ip address", () => {
		const req = new Request("http://localhost/api/notes", {
			headers: { "x-forwarded-for": "1.2.3.4" },
		});
		const nextReq = new NextRequest(req);

		let result = proxy(nextReq);
		for (let i = 0; i < 10; i++) {
			result = proxy(nextReq);
		}
		expect(result.status).toBe(429);
	});

	it("should only track the origin ip", () => {
		const req = new Request("http://localhost/api/notes", {
			headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
		});
		const nextReq = new NextRequest(req);

		proxy(nextReq);
		expect(requests.has("1.2.3.4")).toBe(true);
		expect(requests.has("5.6.7.8")).toBe(false);
	});

	it("should track default ip address if none provided", () => {
		const req = new Request("http://localhost/api/notes", {
			headers: {},
		});
		const nextReq = new NextRequest(req);

		proxy(nextReq);
		expect(requests.has("127.0.0.1")).toBe(true);
	});
});
