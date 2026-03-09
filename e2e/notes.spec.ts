import { expect, request as playwrightRequest, test } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

async function getAuthContext() {
	const context = await playwrightRequest.newContext({
		baseURL: BASE_URL,
		storageState: "playwright-auth-state.json",
	});
	return context;
}

async function seedNote(title = "Test Note", content = "Test Content") {
	const api = await getAuthContext();
	const res = await api.post("/api/notes", {
		data: { title, content },
	});
	expect(res.status()).toBe(201);
	const note = await res.json();
	await api.dispose();
	return note;
}

async function deleteNote(id: string) {
	const api = await getAuthContext();
	await api.delete(`/api/notes/${id}`);
	await api.dispose();
}

// ─── Homepage ────────────────────────────────────────────────────────────────

test.describe("Homepage", () => {
	test("shows sign-in prompt when not authenticated", async ({ browser }) => {
		const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
		const page = await context.newPage();
		await page.goto("/");
		await expect(page.getByTestId("sign-in-prompt")).toBeVisible();
		await context.close();
	});

	test("shows notes-not-found when authenticated with no notes", async ({ page }) => {
		const api = await getAuthContext();
		const res = await api.get("/api/notes");
		const notes = await res.json();
		await Promise.all(notes.map((n: { _id: string }) => deleteNote(n._id)));
		await api.dispose();

		await page.goto("/");
		await expect(page.getByTestId("notes-not-found")).toBeVisible();
	});

	test("shows note cards when notes exist", async ({ page }) => {
		const note = await seedNote("Homepage Note", "Homepage Content");

		try {
			await page.goto("/");
			await expect(page.getByTestId("note-card").first()).toBeVisible();
		} finally {
			await deleteNote(note._id);
		}
	});

	test("shows note cards when notes exist and note card links to correct note page", async ({
		page,
	}) => {
		const note = await seedNote("Link Test Note", "Link Test Content");

		try {
			await page.goto("/");
			const card = page.locator(`[data-testid="note-card"][href="/notes/${note._id}"]`);
			await expect(card).toBeVisible();
		} finally {
			await deleteNote(note._id);
		}
	});
});

// ─── Create Note ─────────────────────────────────────────────────────────────

test.describe("Create Note", () => {
	let createdNoteId: string | null = null;

	test.beforeEach(async ({ page }) => {
		await page.goto("/create");
		await page.waitForSelector('[data-testid="create-note-button"]');
	});

	test.afterEach(async () => {
		if (createdNoteId) {
			await deleteNote(createdNoteId);
			createdNoteId = null;
		}
	});

	test("can navigate to create page", async ({ page }) => {
		await expect(page.getByTestId("title-input")).toBeVisible();
		await expect(page.getByTestId("content-input")).toBeVisible();
		await expect(page.getByTestId("create-note-button")).toBeVisible();
	});

	test("back button returns to homepage", async ({ page }) => {
		await page.getByTestId("back-button").click();
		await expect(page).toHaveURL("/");
	});

	test("shows validation error when fields are empty", async ({ page }) => {
		await page.getByTestId("create-note-button").click();
		await expect(page.getByText("All fields are required")).toBeVisible();
	});

	test("shows validation error when only title is filled", async ({ page }) => {
		await page.getByTestId("title-input").fill("Only Title");
		await page.getByTestId("create-note-button").click();
		await expect(page.getByText("All fields are required")).toBeVisible();
	});

	test("shows validation error when only content is filled", async ({ page }) => {
		await page.getByTestId("content-input").fill("Only Content");
		await page.getByTestId("create-note-button").click();
		await expect(page.getByText("All fields are required")).toBeVisible();
	});

	test("creates a note and redirects to homepage", async ({ page }) => {
		await page.getByTestId("title-input").fill("Brand New Note");
		await page.getByTestId("content-input").fill("Brand New Content");
		await page.getByTestId("create-note-button").click();
		await expect(page).toHaveURL("/");

		const api = await getAuthContext();
		const res = await api.get("/api/notes");
		const notes = await res.json();
		const created = notes.find((n: { title: string; _id: string }) => n.title === "Brand New Note");
		if (created) createdNoteId = created._id;
		await api.dispose();
	});

	test("creates a note with special characters in title", async ({ page }) => {
		await page.getByTestId("title-input").fill("Special !@#$%^&*() Characters");
		await page.getByTestId("content-input").fill("Special content");
		await page.getByTestId("create-note-button").click();
		await expect(page).toHaveURL("/");

		const api = await getAuthContext();
		const res = await api.get("/api/notes");
		const notes = await res.json();
		const created = notes.find(
			(n: { title: string; _id: string }) => n.title === "Special !@#$%^&*() Characters",
		);
		if (created) createdNoteId = created._id;
		await api.dispose();
	});
});

// ─── Edit Note ────────────────────────────────────────────────────────────────

test.describe("Edit Note", () => {
	let noteId: string;

	test.beforeEach(async ({ page }) => {
		const note = await seedNote("Original Title", "Original Content");
		noteId = note._id;
		await page.goto(`/notes/${noteId}`);
		await page.waitForSelector('[data-testid="title-input"]');
	});

	test.afterEach(async () => {
		try {
			await deleteNote(noteId);
		} catch {
			// Already deleted or never created
		}
	});

	test("loads note data into form fields", async ({ page }) => {
		await expect(page.getByTestId("title-input")).toHaveValue("Original Title");
		await expect(page.getByTestId("content-input")).toHaveValue("Original Content");
	});

	test("back button returns to homepage", async ({ page }) => {
		await page.getByTestId("back-button").click();
		await expect(page).toHaveURL("/");
	});

	test("shows validation error when title is cleared", async ({ page }) => {
		await page.getByTestId("title-input").clear();
		await page.getByTestId("save-note-button").click();
		await expect(page.getByText("All fields are required")).toBeVisible();
	});

	test("shows validation error when content is cleared", async ({ page }) => {
		await page.getByTestId("content-input").clear();
		await page.getByTestId("save-note-button").click();
		await expect(page.getByText("All fields are required")).toBeVisible();
	});

	test("saves updated note and redirects to homepage", async ({ page }) => {
		await page.getByTestId("title-input").fill("Updated Title");
		await page.getByTestId("content-input").fill("Updated Content");
		await page.getByTestId("save-note-button").click();
		await expect(page).toHaveURL("/");

		const api = await getAuthContext();
		const res = await api.get(`/api/notes/${noteId}`);
		const updated = await res.json();
		expect(updated.title).toBe("Updated Title");
		expect(updated.content).toBe("Updated Content");
		await api.dispose();
	});
});

// ─── Delete Note ──────────────────────────────────────────────────────────────

test.describe("Delete Note", () => {
	let noteId: string;

	test.beforeEach(async () => {
		const note = await seedNote("Note To Delete", "Delete Me");
		noteId = note._id;
	});

	test.afterEach(async () => {
		try {
			await deleteNote(noteId);
		} catch {
			// Already deleted
		}
	});

	test("cancel delete keeps note intact", async ({ page }) => {
		await page.goto(`/notes/${noteId}`);
		await page.waitForSelector('[data-testid="delete-button"]');
		page.once("dialog", (dialog) => dialog.dismiss());
		await page.getByTestId("delete-button").click();
		await expect(page).toHaveURL(`/notes/${noteId}`);
		await expect(page.getByTestId("selected-note")).toBeVisible();
	});

	test("confirm delete removes note and redirects to homepage", async ({ page }) => {
		await page.goto(`/notes/${noteId}`);
		await page.waitForSelector('[data-testid="delete-button"]');
		page.once("dialog", (dialog) => dialog.accept());
		await page.getByTestId("delete-button").click();
		await expect(page).toHaveURL("/");

		const api = await getAuthContext();
		const res = await api.get(`/api/notes/${noteId}`);
		expect(res.status()).toBe(404);
		await api.dispose();
	});
});
