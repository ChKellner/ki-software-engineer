import { expect, test } from '@playwright/test';

const book  
  id: '1',
  title: 'Angular in Practice',
  subtitle: 'Building useful apps',
  author: 'Alex Reader',
  publisher: 'Example Press',
  numPages: 320,
  isbn: '9781234567890',
  price: '29.95 EUR',
  abstract: 'A practical guide to Angular.',
  userId: 1,
  cover:
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="160"%3E%3Crect width="120" height="160" fill="blue"/%3E%3C/svg%3E'
};
const origin = 'http://localhost:4200';
const api = 'http://localhost:4730/books';

test('opens a card using the keyboard and returns to the collection', async ({ page }) => {
  await page.route(`${api}*`, route => route.fulfill({ json: [book] }));
  await page.route(`${api}/1`, route => route.fulfill({ json: book }));
  await page.goto(origin);
  await page.getByPlaceholder('Search for books...').focus();
  await page.keyboard.press('Tab');
  const card = page.getByRole('link', { name: `View details for ${book.title}` });
  await expect(card).toBeFocused();
  await expect(card).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${origin}/books/1`);
  await expect(page.getByRole('heading', { name: book.title, exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Back to books' }).click();
  await expect(card).toBeVisible();
});

for (const width of [390, 1280]) {
  test(`direct details URL displays all fields at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route(`${api}/1`, route => route.fulfill({ json: book }));
    await page.goto(`${origin}/books/1`);
    const details = page.getByRole('region', { name: book.title });
    await expect(details).toBeVisible();
    for (const value of [
      book.title,
      book.subtitle,
      book.author,
      book.abstract,
      book.publisher,
      String(book.numPages),
      book.isbn,
      book.price
    ]) {
      await expect(details.getByText(value, { exact: true })).toBeVisible();
    }
    await expect(details.getByRole('img', { name: book.title })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const image = await details.getByRole('img').boundingBox();
    const title = await details.getByRole('heading').boundingBox();
    expect(image).not.toBeNull();
    expect(title).not.toBeNull();
    if (width < 768) expect(title!.y).toBeGreaterThan(image!.y + image!.height);
    else expect(title!.x).toBeGreaterThan(image!.x + image!.width);
  });
}

test('shows loading until the response arrives and handles a missing cover', async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>(resolve => {
    release = resolve;
  });
  await page.route(`${api}/1`, async route => {
    await pending;
    await route.fulfill({ json: { ...book, cover: '', subtitle: undefined } });
  });
  await page.goto(`${origin}/books/1`);
  await expect(page.getByRole('status')).toHaveText('Loading book details...');
  release();
  await expect(page.getByText('No cover available')).toBeVisible();
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.getByText(book.subtitle)).toHaveCount(0);
});

test('shows a not-found message for HTTP 404', async ({ page }) => {
  await page.route(`${api}/missing`, route => route.fulfill({ status: 404, json: {} }));
  await page.goto(`${origin}/books/missing`);
  await expect(page.getByRole('heading', { name: 'Book not found' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Retry' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Return to the collection' })).toHaveAttribute('href', '/');
});

for (const failure of ['server', 'network']) {
  test(`retries after a ${failure} failure`, async ({ page }) => {
    let requests = 0;
    await page.route(`${api}/1`, route => {
      if (requests++ > 0) return route.fulfill({ json: book });
      return failure === 'server' ? route.fulfill({ status: 500, json: {} }) : route.abort();
    });
    await page.goto(`${origin}/books/1`);
    await expect(page.getByRole('alert')).toContainText('Unable to load book details');
    await expect(page.getByText('Book not found', { exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Retry' }).click();
    await expect(page.getByRole('heading', { name: book.title, exact: true })).toBeVisible();
    await expect(page.getByRole('alert')).toHaveCount(0);
  });
}

test('discards an old detail request when the route changes', async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>(resolve => {
    release = resolve;
  });
  await page.route(`${api}/1`, async route => {
    await pending;
    await route.fulfill({ json: book }).catch(() => {});
  });
  await page.route(`${api}/2`, route => route.fulfill({ json: { ...book, id: '2', title: 'Second book' } }));
  await page.goto(`${origin}/books/1`);
  await expect(page.getByRole('status')).toBeVisible();
  await page.evaluate(() => {
    history.pushState({}, '', '/books/2');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(page.getByRole('heading', { name: 'Second book' })).toBeVisible();
  release();
  await expect(page.getByRole('heading', { name: 'Second book' })).toBeVisible();
});

test('shows a fallback for a broken cover', async ({ page }) => {
  await page.route(`${api}/1`, route =>
    route.fulfill({ json: { ...book, cover: 'http://localhost:4730/broken.png' } })
  );
  await page.route('**/broken.png', route => route.abort());
  await page.goto(`${origin}/books/1`);
  await expect(page.getByText('No cover available')).toBeVisible();
});
