import { expect, test } from '@playwright/test';

test.describe('Thai Road Trip — parcours critique', () => {
  test('ouvre l’application et affiche l’écran principal', async ({ page }) => {
    await page.goto('/');
    // Avant le 30 août : écran préparation ; pendant : Jour X ; après : résumé.
    await expect(
      page
        .getByRole('heading', { name: /Préparation|Jour \d|Voyage terminé/ })
        .first(),
    ).toBeVisible({ timeout: 15_000 });
    // Navigation basse présente
    await expect(page.getByRole('link', { name: "Aujourd'hui" })).toBeVisible();
  });

  test('marque une activité terminée, persiste après refresh, la reporte au 4 septembre', async ({
    page,
  }) => {
    await page.goto('/jour/d2');
    await expect(page.getByRole('heading', { name: /Jour 2/ })).toBeVisible({ timeout: 15_000 });

    // Ouvre Wat Umong dans la timeline et termine-la
    await page.getByRole('button', { name: /Wat Umong/ }).first().click();
    await page.getByRole('button', { name: 'Terminé', exact: true }).click();
    await expect(page.getByText('Activité terminée').first()).toBeVisible();

    // Persistance après refresh
    await page.reload();
    await expect(page.getByRole('heading', { name: /Jour 2/ })).toBeVisible({ timeout: 15_000 });
    const umongCard = page.getByRole('button', { name: /Wat Umong/ }).first();
    await expect(umongCard).toContainText('Terminée');

    // Reporter le Monk's Trail → doit apparaître dans "À rattraper" du 4 septembre
    await page.getByRole('button', { name: /Monk's Trail/ }).first().click();
    await page.getByRole('button', { name: 'Reporter', exact: true }).click();
    await expect(page.getByText('Reporté au 4 septembre').first()).toBeVisible();

    await page.goto('/jour/d6');
    await expect(page.getByRole('heading', { name: /Jour 6/ })).toBeVisible({ timeout: 15_000 });
    const catchUp = page.locator('section', { hasText: 'À rattraper' }).first();
    await expect(catchUp.getByText(/Monk's Trail/).first()).toBeVisible();

    // L'ajouter au programme du jour → visible dans la timeline du 4
    await catchUp.getByRole('button', { name: /Ajouter au jour/ }).first().click();
    await expect(page.getByText('Ajouté au programme du 4 septembre').first()).toBeVisible();
    await expect(
      page.locator('ol').getByRole('button', { name: /Monk's Trail/ }).first(),
    ).toBeVisible();
  });

  test('ajoute une dépense et la retrouve dans le budget', async ({ page }) => {
    await page.goto('/budget');
    await expect(page.getByRole('heading', { name: 'Budget' })).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: /Dépense/ }).first().click();
    await page.getByLabel('Montant (฿)').fill('250');
    await page.getByRole('button', { name: 'Ajouter', exact: true }).click();
    await expect(page.getByText('Dépense ajoutée').first()).toBeVisible();
    await page.reload();
    await expect(page.getByText(/250\s?฿/).first()).toBeVisible({ timeout: 15_000 });
  });

  test('exporte une sauvegarde JSON valide', async ({ page }) => {
    await page.goto('/reglages');
    await expect(page.getByRole('heading', { name: 'Réglages' })).toBeVisible({ timeout: 15_000 });
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Exporter le voyage/ }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/thai-road-trip-sauvegarde-.*\.json/);
  });
});
