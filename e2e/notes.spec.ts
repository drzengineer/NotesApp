// biome-ignore-all lint/style/noNonNullAssertion: test files assert hard failures

import { expect, test } from "@playwright/test";

test.describe("when notes exist", () => {
	let noteId: string;

	test.beforeEach(async ({ request }) => {
		const response = await request.post("/api/notes", {
			data: { title: "Test Note", content: "Test Content" },
		});
		const note = await response.json();
		noteId = note._id;
	});

	test("homepage displays notes", async ({ page }) => {
		await page.goto("/");

		const note = page.locator(`[data-testid="note-card"][href="/notes/${noteId}"]`);

		await expect(note).toBeVisible();
	});

	test("delete note and refresh homepage", async ({ page }) => {
		await page.goto("/");

		page.on("dialog", (dialog) => dialog.accept());
		await page
			.locator(`[data-testid="note-card"][href="/notes/${noteId}"]`)
			.locator('[data-testid="delete-button"]')
			.click();

		const note = page.locator(`[data-testid="note-card"][href="/notes/${noteId}"]`);

		await expect(note).not.toBeVisible();
		noteId = "";
	});

	test("click delete and cancel", async ({ page }) => {
		await page.goto("/");

		page.on("dialog", (dialog) => dialog.dismiss());
		await page
			.locator(`[data-testid="note-card"][href="/notes/${noteId}"]`)
			.locator('[data-testid="delete-button"]')
			.click();

		const note = page.locator(`[data-testid="note-card"][href="/notes/${noteId}"]`);

		await expect(note).toBeVisible();
	});

	test.afterEach(async ({ request }) => {
		if (noteId) {
			await request.delete(`/api/notes/${noteId}`);
		}
	});
});

test.describe("when creating a new note", () => {
	const unique = crypto.randomUUID();
	let noteId: string;

	test("creates a note and redirects to homepage", async ({ page }) => {
		await page.goto("/create");

		await page.locator('[data-testid="title-input"]').fill(unique);
		await page.locator('[data-testid="content-input"]').fill("create-test-content");

		await page.locator('[data-testid="create-note-button"]').click();

		await page.waitForURL("/");

		const noteCard = page.locator('[data-testid="note-card"]').filter({ hasText: unique });
		await expect(noteCard).toBeVisible();
		const href = await noteCard.getAttribute("href");
		noteId = href!.split("/").pop()!;
	});

	test("show all fields required message when submitting incomplete note", async ({ page }) => {
		await page.goto("/create");
		await page.locator('[data-testid="content-input"]').fill("create-test-content");

		await page.locator('[data-testid="create-note-button"]').click();

		const toast = page.getByText("All fields are required");
		await expect(toast).toBeVisible();
	});

	test("return to homepage after clicking back", async ({ page }) => {
		await page.goto("/create");
		await page.locator('[data-testid="back-button"]').click();

		await page.waitForURL("/");

		const nav = page.locator('[data-testid="navBar"]');
		await expect(nav).toBeVisible();
	});

	test("handles special characters in note title", async ({ page }) => {
		const specialTitle = `<script>alert('xss')</script> & "quoted" 'chars'`;

		await page.goto("/create");
		await page.locator('[data-testid="title-input"]').fill(specialTitle);
		await page.locator('[data-testid="content-input"]').fill("special character test content");
		await page.locator('[data-testid="create-note-button"]').click();

		await page.waitForURL("/");

		const noteCard = page
			.locator('[data-testid="note-card"]')
			.filter({ hasText: "<script>alert('xss')</script>" });
		await expect(noteCard).toBeVisible();
		const href = await noteCard.getAttribute("href");
		noteId = href!.split("/").pop()!;
	});

	test.afterEach(async ({ request }) => {
		if (noteId) {
			await request.delete(`/api/notes/${noteId}`);
		}
	});
});

test.describe("when selecting note", () => {
	let noteId: string;
	const unique = crypto.randomUUID();

	test.beforeEach(async ({ request }) => {
		const response = await request.post("/api/notes", {
			data: { title: "Test Note", content: "Test Content" },
		});
		const note = await response.json();
		noteId = note._id;
	});

	test("update note and redirect to homepage", async ({ page }) => {
		await page.goto(`/notes/${noteId}`);

		await page.locator('[data-testid="title-input"]').fill(unique);
		await page.locator('[data-testid="content-input"]').fill("updated content");

		await page.locator('[data-testid="create-note-button"]').click();

		await page.waitForURL("/");

		const noteCard = page.locator('[data-testid="note-card"]').filter({ hasText: unique });
		await expect(noteCard).toBeVisible();
	});

	test("show all fields required message when submitting incomplete note", async ({ page }) => {
		await page.goto(`/notes/${noteId}`);

		await page.locator('[data-testid="title-input"]').clear();

		await page.locator('[data-testid="create-note-button"]').click();

		const toast = page.getByText("All fields are required");
		await expect(toast).toBeVisible();
	});

	test("return to homepage after clicking back", async ({ page }) => {
		await page.goto(`/notes/${noteId}`);
		await page.locator('[data-testid="back-button"]').click();

		await page.waitForURL("/");

		const nav = page.locator('[data-testid="navBar"]');
		await expect(nav).toBeVisible();
	});

	test("delete note and return to homepage", async ({ page }) => {
		await page.goto(`/notes/${noteId}`);
		page.on("dialog", (dialog) => dialog.accept());
		await page.locator('[data-testid="delete-button"]').click();

		await page.waitForURL("/");

		const nav = page.locator('[data-testid="navBar"]');
		await expect(nav).toBeVisible();
		const note = page.locator(`[data-testid="note-card"][href="/notes/${noteId}"]`);
		await expect(note).not.toBeVisible();
		noteId = "";
	});

	test("click delete and cancel", async ({ page }) => {
		await page.goto(`/notes/${noteId}`);
		page.on("dialog", (dialog) => dialog.dismiss());
		await page.locator('[data-testid="delete-button"]').click();

		const note = page.locator(`[data-testid="selected-note"]`);
		await expect(note).toBeVisible();
	});

	test.afterEach(async ({ request }) => {
		if (noteId) {
			await request.delete(`/api/notes/${noteId}`);
		}
	});
});
