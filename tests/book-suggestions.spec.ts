import { expect, Page, test } from '@playwright/test';

const origin = 'http://localhost:4200';
const api = 'http://localhost:4730';
const suggestion = { title: 'The Dispossessed', author: 'Ursula K. Le Guin' };

// Proposed UI/API contract for the new feature, following the app's English UI:
// "Suggest a book" opens a form with required Title and Author inputs and
// "Submit suggestion". POST /book-suggestions accepts { title, author }.
// Suggestions remain separate from /books until reviewed.
async function openSuggestionForm(page: Page): Promise<void> {
  await page.goto(origin);
  await expect(page.getByRole('heading', { name: 'Book Collection', exact: true })).toBeVisible();
  const entry = page
    .getByRole('button', { name: 'Suggest a book', exact: true })
    .or(page.getByRole('link', { name: 'Suggest a book', exact: true }));
  await expect(entry).toBeVisible();
  await entry.click();
}

async function fillSuggestion(page: Page, values = suggestion): Promise<void> {
  await page.getByRole('textbox', { name: 'Title', exact: true }).fill(values.title);
  await page.getByRole('textbox', { name: 'Author', exact: true }).fill(values.author);
}

test.beforeEach(async ({ page }) => {
  await page.route(`${api}/books*`, route => route.fulfill({ json: [] }));
});

test('AC1: submits title and author for review without adding a book to the collection', async ({ page }) => {
  const submissions: unknown[] = [];
  const collectionWrites: string[] = [];
  await page.route(`${api}/books*`, route => {
    if (route.request().method() !== 'GET') collectionWrites.push(route.request().method());
    return route.fulfill({ json: [] });
  });
  await page.route(`${api}/book-suggestions`, route => {
    if (route.request().method() === 'POST') submissions.push(route.request().postDataJSON());
    return route.fulfill({ status: 201, json: { id: 'suggestion-1', ...suggestion } });
  });

  await openSuggestionForm(page);
  await fillSuggestion(page);
  await page.getByRole('button', { name: 'Submit suggestion', exact: true }).click();

  await expect(page.getByRole('status')).toContainText('Suggestion submitted');
  expect(submissions).toEqual([suggestion]);
  await page.goto(origin);
  await expect(page.getByText('No books available', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: `View details for ${suggestion.title}` })).toHaveCount(0);
  expect(collectionWrites).toEqual([]);
});

test('AC1: sends the latest title and author after editing the form', async ({ page }) => {
  const editedSuggestion = { title: 'Kindred', author: 'Octavia E. Butler' };
  const submissions: unknown[] = [];
  await page.route(`${api}/book-suggestions`, route => {
    expect(route.request().method()).toBe('POST');
    submissions.push(route.request().postDataJSON());
    return route.fulfill({ status: 201, json: { id: 'suggestion-2' } });
  });

  await openSuggestionForm(page);
  await fillSuggestion(page);
  await fillSuggestion(page, editedSuggestion);
  await page.getByRole('button', { name: 'Submit suggestion', exact: true }).click();

  await expect(page.getByRole('status')).toContainText('Suggestion submitted');
  expect(submissions).toEqual([editedSuggestion]);
});

for (const missingField of ['Title', 'Author'] as const) {
  test(`AC2: requires ${missingField} before sending a suggestion`, async ({ page }) => {
    const submissions: string[] = [];
    await page.route(`${api}/book-suggestions`, route => {
      submissions.push(route.request().method());
      return route.fulfill({ status: 201, json: { id: 'suggestion-1', ...suggestion } });
    });

    await openSuggestionForm(page);
    await fillSuggestion(page);
    const input = page.getByRole('textbox', { name: missingField, exact: true });
    await input.fill('');
    await expect(input).toHaveAttribute('required');
    await page.getByRole('button', { name: 'Submit suggestion', exact: true }).click();

    await expect(input.and(page.locator(':invalid'))).toBeVisible();
    await expect(page.getByRole('status').filter({ hasText: 'Suggestion submitted' })).toHaveCount(0);
    expect(submissions).toEqual([]);
  });
}

test('AC3: confirms submission only after the server accepts the suggestion', async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>(resolve => {
    release = resolve;
  });
  await page.route(`${api}/book-suggestions`, async route => {
    await pending;
    await route.fulfill({ status: 201, json: { id: 'suggestion-1', ...suggestion } });
  });

  try {
    await openSuggestionForm(page);
    await fillSuggestion(page);
    await page.getByRole('button', { name: 'Submit suggestion', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('Submitting suggestion');
    await expect(page.getByRole('status').filter({ hasText: 'Suggestion submitted' })).toHaveCount(0);
    release();
    await expect(page.getByRole('status')).toContainText('Suggestion submitted');
  } finally {
    release();
  }
});

test('AC4: reports a server failure and preserves the suggestion for another attempt', async ({ page }) => {
  const submissions: unknown[] = [];
  await page.route(`${api}/book-suggestions`, route => {
    expect(route.request().method()).toBe('POST');
    submissions.push(route.request().postDataJSON());
    return submissions.length === 1
      ? route.fulfill({ status: 500, json: {} })
      : route.fulfill({ status: 201, json: { id: 'suggestion-1' } });
  });

  await openSuggestionForm(page);
  await fillSuggestion(page);
  await page.getByRole('button', { name: 'Submit suggestion', exact: true }).click();

  await expect(page.getByRole('alert')).toContainText('Unable to submit suggestion');
  await expect(page.getByRole('textbox', { name: 'Title', exact: true })).toHaveValue(suggestion.title);
  await expect(page.getByRole('textbox', { name: 'Author', exact: true })).toHaveValue(suggestion.author);
  await expect(page.getByRole('status').filter({ hasText: 'Suggestion submitted' })).toHaveCount(0);
  expect(submissions).toEqual([suggestion]);

  await page.getByRole('button', { name: 'Submit suggestion', exact: true }).click();

  await expect(page.getByRole('status')).toContainText('Suggestion submitted');
  await expect(page.getByRole('alert')).toHaveCount(0);
  expect(submissions).toEqual([suggestion, suggestion]);
});
