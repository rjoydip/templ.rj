import { expect, test } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Templ/)
})

test('documentation link', async ({ page }) => {
  await page.goto('/')

  // Click the get started link.
  await page.getByRole('link', { name: 'Documentation' }).click()

  // Expects page to have a heading with the name of Installation.
  // await expect(page.getByRole('heading', { name: 'templ/README.md at main · rjoydip/templ' })).toBeVisible()
})
