import { expect, test } from '@playwright/test';
const api = 'http://localhost:4730/books';
const book = {
  id: '1',
  title: 'Current result',
  author: 'Author',
  cover: '',
  isbn: '',
  publisher: '',
  numPages: 1,
  price: '',
  abstract: '',
  userId: 1
};

test('shows an error and retries the list', async ({ page }) => {
  let requests = 0;
  await page.route(`${api}*`, route =>
    requests++ ? route.fulfill({ json: [book] }) : route.fulfill({ status: 500, json: {} })
  );
  await page.goto('http://localhost:4200/');
  await expect(page.getByRole('alert')).toContainText('Unable to load books');
  await expect(page.getByText('No books available')).toHaveCount(0);
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByText('Current result')).toBeVisible();
});

test('cancels obsolete searches and clears immediately', async ({ page }) => {
  let release!: () => void;
  let started!: () => void;
  const pending = new Promise<void>(resolve => {
    release = resolve;
  });
  const requested = new Promise<void>(resolve => {
    started = resolve;
  });
  const terms: string[] = [];
  await page.route(`${api}*`, async route => {
    const term = new URL(route.request().url()).searchParams.get('q') || '';
    terms.push(term);
    if (term === 'old') {
      started();
      await pending;
      await route.fulfill({ json: [{ ...book, title: 'Old result' }] }).catch(() => {});
    } else await route.fulfill({ json: [{ ...book, title: term || 'Collection' }] });
  });
  await page.goto('http://localhost:4200/');
  await expect(page.getByText('Collection', { exact: true })).toBeVisible();
  const input = page.getByLabel('Search for books');
  await input.fill('old');
  await requested;
  await input.fill('new');
  await expect(page.getByText('new', { exact: true })).toBeVisible();
  release();
  await expect(page.getByText('Old result')).toHaveCount(0);
  await input.fill('pending');
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.getByText('Collection', { exact: true })).toBeVisible();
  await page.waitForTimeout(400);
  expect(terms).not.toContain('pending');
});

test('shows a fallback for a broken card cover', async ({ page }) => {
  await page.route(`${api}*`, route =>
    route.fulfill({ json: [{ ...book, cover: 'http://localhost:4730/broken.png' }] })
  );
  await page.route('**/broken.png', route => route.abort());
  await page.goto('http://localhost:4200/');
  await expect(page.getByText('No cover available')).toBeVisible();
});
